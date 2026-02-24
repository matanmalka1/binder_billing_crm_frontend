import { DetailDrawer, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { DescriptionList } from "../../../components/ui/DescriptionList";
import { ScheduleChecklist } from "./ScheduleChecklist";
import { StatusTransitionPanel } from "./StatusTransitionPanel";
import { AnnualReportDetailForm } from "./AnnualReportDetailForm";
import { StatusHistoryTimeline } from "./StatusHistoryTimeline";
import { useReportDetail } from "../hooks/useReportDetail";
import { useAnnualReportDetail } from "../hooks/useAnnualReportDetail";
import {
  getStatusLabel,
  getStatusVariant,
  getClientTypeLabel,
  getDeadlineTypeLabel,
} from "../../../api/annualReports.extended.utils";
import { formatDate } from "../../../utils/utils";

interface AnnualReportDetailDrawerProps {
  reportId: number | null;
  onClose: () => void;
}

export const AnnualReportDetailDrawer: React.FC<AnnualReportDetailDrawerProps> = ({
  reportId,
  onClose,
}) => {
  const {
    report,
    isLoading,
    transition,
    isTransitioning,
    completeSchedule,
    isCompletingSchedule,
  } = useReportDetail(reportId);

  const { detail, updateDetail, isUpdating } = useAnnualReportDetail(reportId);

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
          value: report.assessment_amount != null
            ? `₪${report.assessment_amount.toLocaleString("he-IL")}`
            : "—",
        },
        {
          label: "החזר מס",
          value: report.refund_due != null
            ? `₪${report.refund_due.toLocaleString("he-IL")}`
            : "—",
        },
        {
          label: "תשלום נוסף",
          value: report.tax_due != null
            ? `₪${report.tax_due.toLocaleString("he-IL")}`
            : "—",
        },
        { label: "הערות", value: report.notes ?? "—", fullWidth: true },
      ]
    : [];

  return (
    <DetailDrawer open={reportId !== null} title={title} subtitle={subtitle} onClose={onClose}>
      {isLoading && (
        <p className="text-sm text-gray-500 text-center py-8">טוען דוח...</p>
      )}

      {report && detail && (
        <>
          <DrawerSection title="סטטוס">
            <div className="flex flex-wrap gap-2 py-2">
              <Badge variant={getStatusVariant(report.status)}>{getStatusLabel(report.status)}</Badge>
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

          <DrawerSection title="נספחים">
            <div className="py-2">
              <ScheduleChecklist
                schedules={report.schedules ?? []}
                onComplete={completeSchedule}
                isLoading={isCompletingSchedule}
              />
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
        </>
      )}
    </DetailDrawer>
  );
};
