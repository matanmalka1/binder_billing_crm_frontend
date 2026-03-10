import { useState, useRef, useCallback } from "react";
import { cn } from "../../../utils/utils";
import { useReportDetail } from "../hooks/useReportDetail";
import { AnnualReportPanelLayout } from "./AnnualReportPanelLayout";
import { DeleteReportConfirmDialog } from "./DeleteReportConfirmDialog";
import type { AnnualReportStatus } from "../../../api/annualReports.api";
import type { SectionKey } from "../types";
import AnnualReportSidebar from "./AnnualReportSidebar";
import { AnnualReportOverviewSection } from "./AnnualReportOverviewSection";
import { IncomeExpensePanel } from "./IncomeExpensePanel";
import { TaxCalculationPanel } from "./TaxCalculationPanel";
import { DeductionsTab } from "./DeductionsTab";
import { DocumentsTab } from "./DocumentsTab";
import { FilingTimelineTab } from "./FilingTimelineTab";

interface AnnualReportFullPanelProps {
  reportId: number;
  onClose: () => void;
}

const NAV_ITEMS: { key: SectionKey; icon: string; label: string }[] = [
  { key: "overview", icon: "📋", label: "סקירה" },
  { key: "financials", icon: "💰", label: "הכנסות והוצאות" },
  { key: "tax", icon: "⚖️", label: "חישוב מס" },
  { key: "deductions", icon: "✂️", label: "ניכויים" },
  { key: "documents", icon: "📄", label: "מסמכים" },
  { key: "timeline", icon: "📅", label: "ציר זמן" },
];

const tabVariants: Record<"active" | "inactive", string> = {
  active: "border-b-2 border-blue-600 text-blue-700 font-semibold",
  inactive: "text-gray-500 hover:text-gray-800",
};

export const AnnualReportFullPanel = ({ reportId, onClose }: AnnualReportFullPanelProps) => {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [isDirty, setIsDirty] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const submitRef = useRef<(() => void) | null>(null);

  const { report, isLoading, error, transition, updateDetail, isUpdating, completeSchedule, isCompletingSchedule, deleteReport, isDeleting } =
    useReportDetail(reportId, onClose);

  const handleSave = useCallback(() => { submitRef.current?.(); }, []);
  const handleDeleteConfirm = useCallback(async () => {
    await deleteReport();
    setShowDeleteConfirm(false);
  }, [deleteReport]);

  const handleTransition = (action: string, note?: string) => {
    transition({ status: action as AnnualReportStatus, note: note ?? null });
  };

  const renderContent = () => {
    if (!report) return null;
    switch (activeSection) {
      case "overview":
        return (
          <AnnualReportOverviewSection
            report={report} detail={report} schedules={[]}
            onDetailSave={updateDetail} isSaving={isUpdating}
            onScheduleComplete={completeSchedule} isScheduleLoading={isCompletingSchedule}
            clientId={report.client_id} onDirtyChange={setIsDirty} submitRef={submitRef}
          />
        );
      case "financials": return <IncomeExpensePanel reportId={reportId} />;
      case "tax": return <TaxCalculationPanel reportId={reportId} />;
      case "deductions": return <DeductionsTab reportId={reportId} />;
      case "documents": return <DocumentsTab clientId={report.client_id} />;
      case "timeline": return <FilingTimelineTab reports={[report]} />;
    }
  };

  return (
    <>
      <AnnualReportPanelLayout
        open={true}
        title={isLoading ? "טוען דוח..." : `דוח שנתי ${report?.tax_year ?? ""}`}
        subtitle={report ? `לקוח #${report.client_id}` : undefined}
        onClose={onClose}
        onDelete={() => setShowDeleteConfirm(true)}
        onSave={handleSave}
        isDirty={isDirty}
        isSaving={isUpdating}
      >
        {isLoading && (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">טוען דוח...</div>
        )}
        {!isLoading && (error || !report) && (
          <div className="flex flex-1 items-center justify-center text-sm text-red-500">
            {error ?? "שגיאה בטעינת הדוח"}
          </div>
        )}
        {!isLoading && report && (
          <div className="flex h-full w-full overflow-hidden" dir="rtl">
            <div className="flex md:hidden shrink-0 overflow-x-auto border-b border-gray-200 bg-white">
              {NAV_ITEMS.map(({ key, icon, label }) => (
                <button key={key} type="button" onClick={() => setActiveSection(key)}
                  className={cn("flex items-center gap-1 px-3 py-2 text-xs whitespace-nowrap",
                    tabVariants[activeSection === key ? "active" : "inactive"])}
                >
                  <span>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
            <div className="hidden md:flex">
              <AnnualReportSidebar
                activeSection={activeSection} onSectionChange={setActiveSection}
                report={report} detail={null} availableActions={[]} onTransition={handleTransition}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
          </div>
        )}
      </AnnualReportPanelLayout>

      {showDeleteConfirm && (
        <DeleteReportConfirmDialog
          isDeleting={isDeleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

AnnualReportFullPanel.displayName = "AnnualReportFullPanel";
