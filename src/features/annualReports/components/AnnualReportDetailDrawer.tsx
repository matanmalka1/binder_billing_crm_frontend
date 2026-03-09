import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DetailDrawer, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { DescriptionList } from "../../../components/ui/DescriptionList";
import { ConfirmDialog } from "../../actions/components/ConfirmDialog";
import { ScheduleChecklist } from "./ScheduleChecklist";
import { StatusTransitionPanel } from "./StatusTransitionPanel";
import { AnnualReportDetailForm } from "./AnnualReportDetailForm";
import { StatusHistoryTimeline } from "./StatusHistoryTimeline";
import { IncomeExpensePanel } from "./IncomeExpensePanel";
import { ReadinessCheckPanel } from "./ReadinessCheckPanel";
import { TaxCalculationPanel } from "./TaxCalculationPanel";
import { FinalBalancePanel } from "./FinalBalancePanel";
import { DeadlineUpdatePanel } from "./DeadlineUpdatePanel";
import { useReportDetail } from "../hooks/useReportDetail";
import {
  getStatusLabel,
  getStatusVariant,
  getClientTypeLabel,
} from "../../../api/annualReports.extended.utils";
import { getDeadlineTypeLabel } from "../../../api/taxDeadlines.utils";
import { formatDate } from "../../../utils/utils";

interface AnnualReportDetailDrawerProps {
  reportId: number | null;
  onClose: () => void;
}

export const AnnualReportDetailDrawer: React.FC<AnnualReportDetailDrawerProps> = ({
  reportId,
  onClose,
}) => {
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

  const detail = report;

  const title = report ? `דוח שנתי ${report.tax_year}` : "דוח שנתי";
  const subtitle = report?.client_name
    ? `לקוח ${report.client_name} (#${report.client_id})`
    : report
      ? `לקוח #${report.client_id}`
      : undefined;

  const baseDetails = report
    ? [
        { label: "מזהה דוח", value: report.id },
        { label: "מזהה לקוח", value: report.client_id },
        { label: "סוג מועד", value: getDeadlineTypeLabel(report.deadline_type) },
        { label: "מועד הגשה", value: formatDate(report.filing_deadline) },
        { label: "הוגש בתאריך", value: formatDate(report.submitted_at) },
        { label: "מספר אסמכתא", value: report.ita_reference ?? "—" },
        {
          label: "שומה",
          value:
            report.assessment_amount != null
              ? `₪${report.assessment_amount.toLocaleString("he-IL")}`
              : "—",
        },
        {
          label: "החזר מס",
          value:
            report.refund_due != null
              ? `₪${report.refund_due.toLocaleString("he-IL")}`
              : "—",
        },
        {
          label: "תשלום נוסף",
          value:
            report.tax_due != null
              ? `₪${report.tax_due.toLocaleString("he-IL")}`
              : "—",
        },
        { label: "הערות", value: report.notes ?? "—", fullWidth: true },
      ]
    : [];

  return (
    <>
    <ConfirmDialog
      open={isConfirmingDelete}
      title="מחיקת דוח שנתי"
      message={report ? `האם למחוק את הדוח השנתי לשנת ${report.tax_year}? פעולה זו אינה ניתנת לביטול.` : "האם למחוק את הדוח?"}
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
        <p className="text-sm text-gray-500 text-center py-8">טוען דוח...</p>
      )}

      {report && detail && (
        <>
          <DrawerSection title="סטטוס">
            <div className="flex flex-wrap gap-2 py-2">
              <Badge variant={getStatusVariant(report.status)}>
                {getStatusLabel(report.status)}
              </Badge>
              <Badge variant="neutral">שנת מס {report.tax_year}</Badge>
              <Badge variant="info">{getClientTypeLabel(report.client_type)}</Badge>
              <Badge variant="neutral">{report.form_type}</Badge>
            </div>
          </DrawerSection>

          <DrawerSection title="פרטים">
            <div className="py-2">
              <DescriptionList columns={1} items={baseDetails} />
            </div>
          </DrawerSection>

          <DrawerSection title="מועד הגשה">
            <div className="py-2">
              <DeadlineUpdatePanel
                reportId={report.id}
                deadlineType={report.deadline_type}
                filingDeadline={report.filing_deadline}
              />
            </div>
          </DrawerSection>

          <DrawerSection title="נספחים">
            <div className="py-2">
              <ScheduleChecklist
                reportId={report.id}
                schedules={report.schedules ?? []}
                onComplete={completeSchedule}
                isLoading={isCompletingSchedule}
              />
            </div>
          </DrawerSection>

          <DrawerSection title="הכנסות והוצאות">
            <div className="py-2">
              <IncomeExpensePanel reportId={report.id} />
            </div>
          </DrawerSection>

          <DrawerSection title="חישוב מס">
            <div className="py-2">
              <TaxCalculationPanel reportId={report.id} />
            </div>
          </DrawerSection>

          <DrawerSection title="יתרה סופית">
            <div className="py-2">
              <FinalBalancePanel reportId={report.id} />
            </div>
          </DrawerSection>

          <DrawerSection title="מוכנות להגשה">
            <div className="py-2">
              <ReadinessCheckPanel reportId={report.id} />
            </div>
          </DrawerSection>

          <DrawerSection title="מעבר סטטוס">
            <div className="py-2">
              <StatusTransitionPanel
                report={report}
                onTransition={transition}
                isLoading={isTransitioning}
              />
            </div>
          </DrawerSection>

          <DrawerSection title="עדכון פרטי דוח">
            <div className="py-2">
              <AnnualReportDetailForm
                detail={detail}
                onSave={updateDetail}
                isSaving={isUpdating}
              />
            </div>
          </DrawerSection>

          <DrawerSection title="היסטוריית סטטוסים">
            <div className="py-2">
              <StatusHistoryTimeline history={report.status_history ?? []} />
            </div>
          </DrawerSection>

          <DrawerSection title="מחיקה">
            <div className="py-2">
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
          </DrawerSection>
        </>
      )}
    </DetailDrawer>
    </>
  );
};