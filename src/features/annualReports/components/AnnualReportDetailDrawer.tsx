import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DetailDrawer } from "../../../components/ui/DetailDrawer";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../actions/components/ConfirmDialog";
import { useReportDetail } from "../hooks/useReportDetail";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportDetailTabs } from "./ReportDetailTabs";
import { cn } from "../../../utils/utils";

interface AnnualReportDetailDrawerProps {
  reportId: number | null;
  onClose: () => void;
}

const TAB_DEFS = [
  { key: "overview", label: "דוחות שנתיים", icon: "📋" },
  { key: "financials", label: "הכנסות והוצאות", icon: "💰" },
  { key: "tax", label: "חישוב מס", icon: "⚠️" },
  { key: "deductions", label: "ניכויים", icon: "✂️" },
  { key: "timeline", label: "ציר זמן", icon: "📅" },
  { key: "documents", label: "מסמכים", icon: "📄" },
] as const;

export type DetailTab = (typeof TAB_DEFS)[number]["key"];

export const AnnualReportDetailDrawer: React.FC<AnnualReportDetailDrawerProps> = ({
  reportId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const {
    report,
    isLoading,
    transition,
    isTransitioning,
    completeSchedule,
    isCompletingSchedule,
    updateDetail,
    isUpdating,
    deleteReport,
    isDeleting,
  } = useReportDetail(reportId, onClose);

  const title = report ? `דוח שנתי ${report.tax_year}` : "דוח שנתי";
  const subtitle = report?.client_name
    ? `${report.client_name} (#${report.client_id})`
    : report
      ? `לקוח #${report.client_id}`
      : undefined;

  return (
    <>
      <ConfirmDialog
        open={isConfirmingDelete}
        title="מחיקת דוח שנתי"
        message={
          report
            ? `האם למחוק את הדוח השנתי לשנת ${report.tax_year}? פעולה זו אינה ניתנת לביטול.`
            : "האם למחוק את הדוח?"
        }
        confirmLabel="מחק דוח"
        cancelLabel="ביטול"
        isLoading={isDeleting}
        onConfirm={async () => {
          await deleteReport();
          setIsConfirmingDelete(false);
        }}
        onCancel={() => setIsConfirmingDelete(false)}
      />

      <DetailDrawer open={reportId !== null} title={title} subtitle={subtitle} onClose={onClose}>
        {isLoading && (
          <p className="py-8 text-center text-sm text-gray-500">טוען דוח...</p>
        )}

        {report && (
          <div className="flex flex-col gap-4">
            {/* KPI summary cards */}
            <ReportSummaryCards reportId={report.id} />

            {/* Tab bar */}
            <div className="border-b border-gray-200">
              <div className="flex gap-0 overflow-x-auto">
                {TAB_DEFS.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "shrink-0 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                      activeTab === key
                        ? "border-primary-600 text-primary-700"
                        : "border-transparent text-gray-500 hover:text-gray-700",
                    )}
                  >
                    <span className="mr-1">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <ReportDetailTabs
              activeTab={activeTab}
              report={report}
              transition={transition}
              isTransitioning={isTransitioning}
              completeSchedule={completeSchedule}
              isCompletingSchedule={isCompletingSchedule}
              updateDetail={updateDetail}
              isUpdating={isUpdating}
              onSelectReport={() => {}}
            />

            {/* Delete */}
            <div className="pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmingDelete(true)}
                isLoading={isDeleting}
                disabled={isDeleting}
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                מחק דוח
              </Button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </>
  );
};
