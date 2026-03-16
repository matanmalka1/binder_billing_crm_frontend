import { useSearchParams } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Clock } from "lucide-react";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Alert } from "../../../components/ui/Alert";
import { Badge } from "../../../components/ui/Badge";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { TableSkeleton } from "../../../components/ui/TableSkeleton";
import { cn } from "../../../utils/utils";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { useVatWorkItemPage } from "../hooks/useVatWorkItemPage";
import { VatOverviewTab } from "./VatOverviewTab";
import { VatDataEntryTab } from "./VatDataEntryTab";
import { VatHistoryTab } from "./VatHistoryTab";

type TabKey = "overview" | "data-entry" | "history";

export const STATUS_VARIANTS: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  pending_materials: "warning",
  material_received: "info",
  data_entry_in_progress: "info",
  ready_for_review: "warning",
  filed: "success",
};

interface VatWorkItemFullPanelProps {
  workItemId: number;
}

export const VatWorkItemFullPanel: React.FC<VatWorkItemFullPanelProps> = ({ workItemId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabKey) ?? "overview";
  const { workItem, invoices, isLoading, isError } = useVatWorkItemPage(workItemId);

  const setTab = (tab: TabKey) => {
    setSearchParams(tab === "overview" ? {} : { tab });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TableSkeleton rows={1} columns={3} />
        <TableSkeleton rows={5} columns={6} />
      </div>
    );
  }
  if (isError || !workItem) return <Alert variant="error" message='שגיאה בטעינת תיק מע"מ' />;

  const tabs: { key: TabKey; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: "overview", label: "סקירה", icon: LayoutDashboard },
    { key: "data-entry", label: "הקלדת נתונים", icon: ClipboardList, badge: invoices.length },
    { key: "history", label: "היסטוריה", icon: Clock },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title={`תיק מע"מ #${workItem.id} — ${workItem.client_name ?? ""} — ${workItem.period}`}
        breadcrumbs={[{ label: 'דוחות מע"מ', to: "/tax/vat" }]}
      />

      <div className="flex items-center gap-2" dir="rtl">
        <StatusBadge
          status={workItem.status}
          getLabel={getVatWorkItemStatusLabel}
          variantMap={STATUS_VARIANTS}
        />
      </div>

      <div
        role="tablist"
        className="sticky top-0 z-20 flex gap-0 border-b border-gray-200 bg-white/95 backdrop-blur-sm"
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

      <div>
        {activeTab === "overview" && <VatOverviewTab workItem={workItem} />}
        {activeTab === "data-entry" && (
          <VatDataEntryTab
            workItemId={workItem.id}
            status={workItem.status}
            invoices={invoices}
            isLoading={false}
          />
        )}
        {activeTab === "history" && <VatHistoryTab workItemId={workItem.id} />}
      </div>
    </div>
  );
};

VatWorkItemFullPanel.displayName = "VatWorkItemFullPanel";
