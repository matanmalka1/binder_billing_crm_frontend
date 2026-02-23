import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { PageStateGuard } from "../components/ui/PageStateGuard";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { DescriptionList } from "../components/ui/DescriptionList";
import { Button } from "../components/ui/Button";
import { ScheduleChecklist } from "../features/annualReports/components/ScheduleChecklist";
import { StatusHistoryTimeline } from "../features/annualReports/components/StatusHistoryTimeline";
import { StatusTransitionPanel } from "../features/annualReports/components/StatusTransitionPanel";
import { AnnualReportDetailForm } from "../features/annualReports/components/AnnualReportDetailForm";
import { useReportDetail } from "../features/annualReports/hooks/useReportDetail";
import { useAnnualReportDetail } from "../features/annualReports/hooks/useAnnualReportDetail";
import {
  getStatusLabel,
  getStatusVariant,
  getClientTypeLabel,
  getDeadlineTypeLabel,
} from "../api/annualReports.extended.utils";
import { formatDate } from "../utils/utils";

export const AnnualReportDetail: React.FC = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const numericId = Number(reportId);
  const isValidId = Number.isInteger(numericId) && numericId > 0;

  const {
    report,
    isLoading,
    error: reportError,
    transition,
    isTransitioning,
    completeSchedule,
    isCompletingSchedule,
  } = useReportDetail(isValidId ? numericId : null);

  const {
    detail,
    isLoading: isDetailLoading,
    error: detailError,
    updateDetail,
    isUpdating,
  } = useAnnualReportDetail(isValidId ? numericId : null);

  const header = useMemo(
    () => (
      <PageHeader
        title={report ? `דוח שנתי ${report.tax_year}` : "דוח שנתי"}
        description={
          report?.client_name
            ? `לקוח ${report.client_name} (#${report.client_id})`
            : report
              ? `לקוח #${report.client_id}`
              : undefined
        }
        breadcrumbs={[
          { label: "דוחות מס", to: "/tax" },
          { label: "דוחות שנתיים", to: "/tax/reports" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              חזרה
            </Button>
          </div>
        }
      />
    ),
    [navigate, report],
  );

  const statusBadges = report ? (
    <div className="flex flex-wrap gap-2">
      <Badge variant={getStatusVariant(report.status)}>{getStatusLabel(report.status)}</Badge>
      <Badge variant="neutral">שנת מס {report.tax_year}</Badge>
      <Badge variant="info">{getClientTypeLabel(report.client_type)}</Badge>
      <Badge variant="neutral">{report.form_type}</Badge>
    </div>
  ) : null;

  const baseDetails = report
    ? [
        { label: "מזהה דוח", value: report.id },
        { label: "מזהה לקוח", value: report.client_id },
        { label: "סוג מועד", value: getDeadlineTypeLabel(report.deadline_type) },
        { label: "מועד הגשה", value: formatDate(report.filing_deadline) },
        { label: "הוגש בתאריך", value: formatDate(report.submitted_at) },
        { label: "מספר אסמכתא", value: report.ita_reference ?? "—" },
        { label: "שומה", value: report.assessment_amount != null ? `₪${report.assessment_amount.toLocaleString("he-IL")}` : "—" },
        { label: "החזר מס", value: report.refund_due != null ? `₪${report.refund_due.toLocaleString("he-IL")}` : "—" },
        { label: "תשלום נוסף", value: report.tax_due != null ? `₪${report.tax_due.toLocaleString("he-IL")}` : "—" },
        { label: "הערות", value: report.notes ?? "—", fullWidth: true },
      ]
    : [];

  return (
    <PageStateGuard
      header={header}
      isLoading={isValidId ? isLoading || isDetailLoading : false}
      error={
        !isValidId
          ? "מזהה דוח לא תקין"
          : reportError || detailError || null
      }
      loadingMessage="טוען דוח..."
    >
      {report && detail && (
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              {statusBadges}
              <DescriptionList columns={2} items={baseDetails} />
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <ScheduleChecklist
              schedules={report.schedules ?? []}
              onComplete={completeSchedule}
              isLoading={isCompletingSchedule}
            />
            <StatusTransitionPanel
              report={report}
              onTransition={transition}
              isLoading={isTransitioning}
            />
          </div>

          <Card title="עדכון פרטי דוח">
            <AnnualReportDetailForm
              detail={detail}
              onSave={updateDetail}
              isSaving={isUpdating}
            />
          </Card>

          <Card title="היסטוריית סטטוסים">
            <StatusHistoryTimeline history={report.status_history ?? []} />
          </Card>
        </div>
      )}
    </PageStateGuard>
  );
};
