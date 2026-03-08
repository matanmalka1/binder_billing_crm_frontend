import { getYear } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { Select } from "../../components/ui/Select";
import { DataTable, type Column } from "../../components/ui/DataTable";
import { Badge } from "../../components/ui/Badge";
import { QK } from "../../lib/queryKeys";
import { advancePaymentsApi, type AdvancePaymentOverviewRow, type AdvancePaymentStatus } from "../../api/advancePayments.api";
import { MONTH_NAMES, MONTH_OPTIONS, YEAR_OPTIONS, fmtCurrency, STATUS_LABEL, STATUS_VARIANT } from "../../features/advancedPayments/utils";
import { formatDate, parsePositiveInt } from "../../utils/utils";

const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "overdue", label: "באיחור" },
  { value: "pending", label: "ממתין" },
  { value: "partial", label: "חלקי" },
  { value: "paid", label: "שולם" },
];

const MONTH_FILTER_OPTIONS = [
  { value: "", label: "כל החודשים" },
  ...MONTH_OPTIONS,
];

export const AdvancePayments: React.FC = () => {
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
          {STATUS_LABEL[row.status] ?? row.status}
        </Badge>
      ),
    },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const year = parsePositiveInt(searchParams.get("year"), getYear(new Date()));
  const month = parsePositiveInt(searchParams.get("month"), 0);
  const statusFilter = (searchParams.get("status") ?? "") as AdvancePaymentStatus | "";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const queryParams = useMemo(() => ({
    year,
    ...(month > 0 ? { month } : {}),
    ...(statusFilter ? { status: [statusFilter] } : {}),
    page_size: 200,
  }), [year, month, statusFilter]);

  const { data, isLoading, error } = useQuery({
    queryKey: QK.tax.advancePayments.overview(queryParams),
    queryFn: () => advancePaymentsApi.overview(queryParams),
  });

  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="מקדמות — סקירה כללית"
        description="כל הלקוחות עם מקדמות פתוחות, חלקיות או באיחור"
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-transparent">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">סינון</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 max-w-2xl">
            <Select
              label="שנת מס"
              value={String(year)}
              onChange={(e) => setParam("year", e.target.value)}
              options={YEAR_OPTIONS}
            />
            <Select
              label="חודש"
              value={month > 0 ? String(month) : ""}
              onChange={(e) => setParam("month", e.target.value)}
              options={MONTH_FILTER_OPTIONS}
            />
            <Select
              label="סטטוס"
              value={statusFilter}
              onChange={(e) => setParam("status", e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>
        </div>
      </div>

      {error && <ErrorCard message="שגיאה בטעינת מקדמות" />}

      <div className="text-sm text-gray-500">
        {!isLoading && `${rows.length} רשומות`}
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/clients/${row.client_id}?tab=advance-payments`)}
        emptyMessage="אין מקדמות לפי הסינון הנבחר"
      />
    </div>
  );
};
