import type { ComponentType } from "react";
import { cn } from "../../../../utils/utils";
import { Download, LayoutDashboard, TrendingUp, Scale, Scissors, FileText, CalendarClock, Trash2, Save, CreditCard } from "lucide-react";
import { useAnnualReportDetailPage } from "../../hooks/useAnnualReportDetailPage";
import { DeleteReportConfirmDialog } from "./DeleteReportConfirmDialog";
import type { SectionKey } from "../../types";
import { AnnualReportSidebarStatus } from "./AnnualReportSidebarStatus";
import { AnnualReportSectionContent } from "./AnnualReportSectionContent";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { Button } from "../../../../components/ui/primitives/Button";

interface AnnualReportFullPanelProps {
  reportId: number;
  backPath?: string;
}

const NAV_ITEMS: { key: SectionKey; icon: ComponentType<{ size?: number; className?: string }>; label: string }[] = [
  { key: "overview",   icon: LayoutDashboard, label: "סקירה" },
  { key: "financials", icon: TrendingUp,      label: "הכנסות והוצאות" },
  { key: "tax",        icon: Scale,           label: "חישוב מס" },
  { key: "deductions", icon: Scissors,        label: "ניכויים" },
  { key: "documents",  icon: FileText,        label: "מסמכים" },
  { key: "timeline",   icon: CalendarClock,   label: "ציר זמן" },
  { key: "charges",    icon: CreditCard,      label: "חיובים" },
];

const tabVariants: Record<"active" | "inactive", string> = {
  active:   "border-b-2 border-blue-600 text-blue-700 font-semibold bg-blue-50/40",
  inactive: "text-gray-500 hover:text-gray-800 hover:bg-gray-50",
};

export const AnnualReportFullPanel = ({ reportId, backPath = "/tax/reports" }: AnnualReportFullPanelProps) => {
  const {
    report, isLoading, error,
    activeSection, setActiveSection,
    isDirty, setIsDirty,
    showDeleteConfirm, setShowDeleteConfirm,
    isExportingPdf, isAdvisor,
    submitRef,
    isUpdating, isDeleting,
    completeSchedule, addSchedule, isCompletingSchedule, isAddingSchedule,
    updateDetail,
    handleSave, handleExportPdf, handleTransition, handleDeleteConfirm,
  } = useAnnualReportDetailPage(reportId, backPath);

  if (isLoading) {
    return <div className="flex flex-1 items-center justify-center py-24 text-sm text-gray-400">טוען דוח...</div>;
  }

  if (error || !report) {
    return <div className="flex flex-1 items-center justify-center py-24 text-sm text-red-500">{error ?? "שגיאה בטעינת הדוח"}</div>;
  }

  const clientLabel = report.client_name
    ? `${report.client_name} (#${report.client_id})`
    : `לקוח #${report.client_id}`;

  return (
    <>
      <div dir="rtl">
        <PageHeader
          title={`דוח שנתי ${report.tax_year}`}
          description={clientLabel}
          breadcrumbs={[
            { label: "דוחות שנתיים", to: backPath },
            { label: `דוח ${report.tax_year}`, to: "#" },
          ]}
          actions={
            <>
              {isAdvisor && (
                <Button variant="secondary" onClick={handleExportPdf} disabled={isExportingPdf} className="gap-1.5">
                  <Download size={14} />
                  {isExportingPdf ? "מפיק..." : "הורד טיוטה"}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-1.5 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 size={14} />
                מחק דוח
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={!isDirty || isUpdating} className="gap-1.5">
                <Save size={14} />
                {isUpdating ? "שומר..." : "שמור"}
              </Button>
            </>
          }
        />

        {/* Navbar tabs */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex" role="tablist">
            {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeSection === key}
                onClick={() => setActiveSection(key)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap transition-colors first:rounded-r-xl last:rounded-l-xl",
                  tabVariants[activeSection === key ? "active" : "inactive"],
                )}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status strip */}
        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50">
          <AnnualReportSidebarStatus report={report} detail={null} availableActions={[]} onTransition={handleTransition} />
        </div>

        {/* Section content */}
        <div className="mt-6">
          <AnnualReportSectionContent
            reportId={reportId}
            activeSection={activeSection}
            report={report}
            updateDetail={updateDetail}
            isUpdating={isUpdating}
            completeSchedule={completeSchedule}
            addSchedule={addSchedule}
            isCompletingSchedule={isCompletingSchedule}
            isAddingSchedule={isAddingSchedule}
            setIsDirty={setIsDirty}
            submitRef={submitRef}
          />
        </div>
      </div>

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
