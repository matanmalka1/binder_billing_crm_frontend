import { useState } from "react";
import { useSearchParams, useParams, Navigate } from "react-router-dom";
import { LayoutDashboard, ClipboardList, ArrowUpCircle, Clock } from "lucide-react";
import { Alert } from "@/components/ui/overlays/Alert";
import { Badge } from "@/components/ui/primitives/Badge";
import { Button } from "@/components/ui/primitives/Button";
import { TableSkeleton } from "@/components/ui/table/TableSkeleton";
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
  const [isFilingPending, setIsFilingPending] = useState(false);
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
      <VatWorkItemSummaryBar workItem={workItem} onFilingPendingChange={setIsFilingPending} />

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
          <Button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setTab(key)}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-none border-b-2 px-5 py-3 focus:ring-0 focus:ring-offset-0",
              activeTab === key
                ? "border-primary-600 bg-primary-50/40 text-primary-700"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {badge !== undefined && badge > 0 && (
              <Badge variant="neutral" className="text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                {badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "summary" && <VatSummaryTab workItem={workItem} invoices={invoices} />}
        {activeTab === "income" && (
          <VatIncomeTab workItemId={workItem.id} status={workItem.status} invoices={invoices} clientStatus={workItem.business_status} isFilingPending={isFilingPending} />
        )}
        {activeTab === "expense" && (
          <VatExpenseTab workItemId={workItem.id} status={workItem.status} invoices={invoices} clientStatus={workItem.business_status} isFilingPending={isFilingPending} />
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
