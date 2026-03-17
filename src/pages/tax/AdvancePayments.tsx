import { getYear } from "date-fns";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { AdvancePaymentReportView } from "../../features/reports/components/AdvancePaymentReportView";
import { cn } from "../../utils/utils";
import { Alert } from "../../components/ui/Alert";
import { ToolbarContainer } from "../../components/ui/ToolbarContainer";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { Badge } from "../../components/ui/Badge";
import { PaginationCard } from "../../components/ui/PaginationCard";
import { OverviewKPICards } from "../../features/advancedPayments/components/OverviewKPICards";
import { AdvancePaymentsFiltersBar } from "../../features/advancedPayments/components/AdvancePaymentsFiltersBar";
import { useAdvancePaymentsOverview } from "../../features/advancedPayments/hooks/useAdvancePaymentsOverview";
import type { AdvancePaymentOverviewRow, AdvancePaymentStatus } from "../../features/advancedPayments/types";
import { MONTH_NAMES, fmtCurrency, STATUS_VARIANT } from "../../features/advancedPayments/utils";
import { getAdvancePaymentStatusLabel } from "../../utils/enums";
import { formatDate, parsePositiveInt } from "../../utils/utils";


const columns: Column<AdvancePaymentOverviewRow>[] = [
  {
    key: "client_name",
    header: "לקוח",
    render: (row) => (
      <span className="text-sm font-semibold text-gray-900">{row.client_name}</span>
    ),
  },
  {
    key: "month",
    header: "חודש",
    render: (row) => (
      <span className="text-sm text-gray-700">{MONTH_NAMES[row.month - 1] ?? row.month}</span>
    ),
  },
  {
    key: "due_date",
    header: "תאריך תשלום",
    render: (row) => (
      <span className="text-sm text-gray-500 tabular-nums">{formatDate(row.due_date)}</span>
    ),
  },
  {
    key: "expected_amount",
    header: "סכום צפוי",
    render: (row) => (
      <span className="font-mono text-sm font-medium text-gray-700 tabular-nums">
        {fmtCurrency(row.expected_amount)}
      </span>
    ),
  },
  {
    key: "paid_amount",
    header: "שולם",
    render: (row) => (
      <span className="font-mono text-sm font-semibold text-green-700 tabular-nums">
        {fmtCurrency(row.paid_amount)}
      </span>
    ),
  },
  {
    key: "status",
    header: "סטטוס",
    render: (row) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? "neutral"}>
        {getAdvancePaymentStatusLabel(row.status)}
      </Badge>
    ),
  },
];

export const AdvancePayments: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get("tab") ?? "overview";

  const setTab = (tab: string) => {
    const next = new URLSearchParams();
    next.set("tab", tab);
    setSearchParams(next);
  };

  const year = parsePositiveInt(searchParams.get("year"), getYear(new Date()));
  const month = parsePositiveInt(searchParams.get("month"), 0);
  const statusFilter = (searchParams.get("status") ?? "") as AdvancePaymentStatus | "";
  const page = parsePositiveInt(searchParams.get("page"), 1);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const { rows, total, totalPages, isLoading, error, kpiData } = useAdvancePaymentsOverview({
    year,
    month,
    statusFilter,
    page,
  });

  const tabToggle = (
    <div
      role="tablist"
      aria-label="תצוגת מקדמות"
      className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 w-fit"
    >
      {(["overview", "report"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => setTab(tab)}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          {tab === "overview" ? "סקירה" : "דוח גבייה"}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="מקדמות"
        description="סקירה ודוחות גבייה לפי שנה, חודש וסטטוס"
        actions={tabToggle}
      />

      {activeTab === "report" && <AdvancePaymentReportView />}

      {activeTab === "overview" && (
        <>
          {!isLoading && kpiData && (
            <OverviewKPICards
              year={year}
              totalExpected={kpiData.total_expected}
              totalPaid={kpiData.total_paid}
              collectionRate={kpiData.collection_rate}
            />
          )}

          <ToolbarContainer>
            <AdvancePaymentsFiltersBar
              year={year}
              month={month}
              status={statusFilter}
              onParamChange={setParam}
            />
          </ToolbarContainer>

          {error && <Alert variant="error" message="שגיאה בטעינת מקדמות" />}

          {!isLoading && (
            <p className="text-sm text-gray-500">{total.toLocaleString("he-IL")} רשומות</p>
          )}

          <DataTable
            columns={columns}
            data={rows}
            getRowKey={(row) => row.id}
            isLoading={isLoading}
            onRowClick={(row) => navigate(`/clients/${row.client_id}?tab=advance-payments`)}
            emptyMessage="אין מקדמות לפי הסינון הנבחר"
          />

          {totalPages > 1 && (
            <PaginationCard
              page={page}
              totalPages={totalPages}
              total={total}
              label="מקדמות"
              onPageChange={(p) => setParam("page", String(p))}
            />
          )}
        </>
      )}
    </div>
  );
};
