import { useSearchParams, useParams, Navigate } from "react-router-dom";
import { LayoutDashboard, ClipboardList, ArrowUpCircle, Clock } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { cn } from "@/utils/utils";
import {
  isFiled,
  useVatWorkItemPage,
  VatExpenseTab,
  VatFiledBanner,
  VatHistoryTab,
  VatIncomeTab,
  VatSummaryTab,
  VatWorkItemSummaryBar,
} from "@/features/vatReports";

type TabKey = "summary" | "income" | "expense" | "history";

const VatDetailContent: React.FC<{ workItemId: number }> = ({ workItemId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabKey) ?? "summary";
  const { workItem, invoices, isLoading, isError } = useVatWorkItemPage(workItemId);

  const setTab = (tab: TabKey) => setSearchParams(tab === "summary" ? {} : { tab });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TableSkeleton rows={1} columns={3} />
        <TableSkeleton rows={5} columns={5} />
      </div>
    );
  }
  if (isError || !workItem) return <Alert variant="error" message='שגיאה בטעינת תיק מע"מ' />;

  const incomeCount = invoices.filter((i) => i.invoice_type === "income").length;
  const expenseCount = invoices.filter((i) => i.invoice_type === "expense").length;

  const tabs: { key: TabKey; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: "summary", label: "סיכום", icon: LayoutDashboard },
    { key: "income", label: "עסקאות", icon: ClipboardList, badge: incomeCount },
    { key: "expense", label: "תשומות", icon: ArrowUpCircle, badge: expenseCount },
    { key: "history", label: "היסטוריה", icon: Clock },
  ];

  return (
    <div className="space-y-4">
      <VatWorkItemSummaryBar workItem={workItem} />

      {isFiled(workItem.status) && workItem.filed_at && (
        <VatFiledBanner
          filedAt={workItem.filed_at}
          filedBy={workItem.filed_by}
          filedByName={workItem.filed_by_name}
          filingMethod={workItem.submission_method}
          submissionReference={workItem.submission_reference}
          isAmendment={workItem.is_amendment}
          amendsItemId={workItem.amends_item_id}
        />
      )}

      {/* Tab bar */}
      <div
        role="tablist"
        className="flex gap-0 border-b border-gray-200 bg-white/95 backdrop-blur-sm"
        dir="rtl"
      >
        {tabs.map(({ key, label, icon: Icon, badge }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
              activeTab === key
                ? "border-b-2 border-primary-600 text-primary-700 bg-primary-50/40"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {badge !== undefined && badge > 0 && (
              <Badge variant="neutral" className="text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                {badge}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "summary" && <VatSummaryTab workItem={workItem} invoices={invoices} />}
        {activeTab === "income" && (
          <VatIncomeTab workItemId={workItem.id} status={workItem.status} invoices={invoices} clientStatus={workItem.business_status} />
        )}
        {activeTab === "expense" && (
          <VatExpenseTab workItemId={workItem.id} status={workItem.status} invoices={invoices} clientStatus={workItem.business_status} />
        )}
        {activeTab === "history" && <VatHistoryTab workItemId={workItem.id} />}
      </div>
    </div>
  );
};

export const VatWorkItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  if (!id || isNaN(numId) || numId <= 0) return <Navigate to="/tax/vat" replace />;
  return <VatDetailContent workItemId={numId} />;
};
