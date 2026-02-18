import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { DescriptionList } from "../../../components/ui/DescriptionList";
import { PageLoading } from "../../../components/ui/PageLoading";
import { useReportDetail } from "../hooks/useReportDetail";
import { StatusTransitionPanel } from "./StatusTransitionPanel";
import { ScheduleChecklist } from "./ScheduleChecklist";
import { StatusHistoryTimeline } from "./StatusHistoryTimeline";
import { getStatusLabel, getStatusVariant, getClientTypeLabel, getDeadlineTypeLabel } from "../../../api/annualReports.extended.utils";
import { formatDate } from "../../../utils/utils";
import type { AnnualReportScheduleKey } from "../../../api/annualReports.extended.api";

type Tab = "details" | "schedules" | "history" | "transition";

interface Props {
  open: boolean;
  reportId: number | null;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<Props> = ({ open, reportId, onClose }) => {
  const { report, isLoading, transition, isTransitioning, completeSchedule, isCompletingSchedule } =
    useReportDetail(open ? reportId : null);
  const [tab, setTab] = useState<Tab>("details");
  const [completingKey, setCompletingKey] = useState<AnnualReportScheduleKey | null>(null);

  const handleComplete = (schedule: AnnualReportScheduleKey) => {
    setCompletingKey(schedule);
    completeSchedule(schedule);
    setTimeout(() => setCompletingKey(null), 1500);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "details", label: "פרטים" },
    { key: "schedules", label: `נספחים${report?.schedules?.length ? ` (${report.schedules.length})` : ""}` },
    { key: "history", label: "היסטוריה" },
    { key: "transition", label: "מעבר סטטוס" },
  ];

  return (
    <Modal
      open={open}
      title={
        report
          ? `דוח שנתי ${report.tax_year} — לקוח #${report.client_id}`
          : "פרטי דוח שנתי"
      }
      onClose={onClose}
      footer={
        <Button type="button" variant="outline" onClick={onClose}>
          סגור
        </Button>
      }
    >
      {isLoading && <PageLoading rows={3} columns={2} message="טוען דוח..." />}

      {report && (
        <div className="space-y-4">
          {/* Status badge row */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusVariant(report.status)}>{getStatusLabel(report.status)}</Badge>
            <Badge variant="neutral">{report.form_type}</Badge>
            <Badge variant="info">{getClientTypeLabel(report.client_type)}</Badge>
            {report.submitted_at && (
              <Badge variant="success">הוגש {formatDate(report.submitted_at)}</Badge>
            )}
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t.key
                    ? "border-blue-500 text-blue-700"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "details" && (
            <DescriptionList
              columns={2}
              items={[
                { label: "מועד הגשה", value: formatDate(report.filing_deadline) },
                { label: "סוג מועד", value: getDeadlineTypeLabel(report.deadline_type) },
                { label: "מספר אסמכתא", value: report.ita_reference ?? "—" },
                { label: "שומה", value: report.assessment_amount ? `₪${report.assessment_amount.toLocaleString("he-IL")}` : "—" },
                { label: "החזר מס", value: report.refund_due ? `₪${report.refund_due.toLocaleString("he-IL")}` : "—" },
                { label: "תשלום נוסף", value: report.tax_due ? `₪${report.tax_due.toLocaleString("he-IL")}` : "—" },
                { label: "הכנסת שכירות", value: report.has_rental_income ? "כן" : "לא" },
                { label: "רווחי הון", value: report.has_capital_gains ? "כן" : "לא" },
                { label: "הכנסות מחו\"ל", value: report.has_foreign_income ? "כן" : "לא" },
                { label: "פחת", value: report.has_depreciation ? "כן" : "לא" },
                { label: "שכר דירה פטור", value: report.has_exempt_rental ? "כן" : "לא" },
                { label: "הערות", value: report.notes ?? "—", fullWidth: true },
              ]}
            />
          )}

          {tab === "schedules" && (
            <ScheduleChecklist
              schedules={report.schedules ?? []}
              onComplete={handleComplete}
              isLoading={isCompletingSchedule}
              completingKey={completingKey}
            />
          )}

          {tab === "history" && (
            <StatusHistoryTimeline history={report.status_history ?? []} />
          )}

          {tab === "transition" && (
            <StatusTransitionPanel
              report={report}
              onTransition={transition}
              isLoading={isTransitioning}
            />
          )}
        </div>
      )}
    </Modal>
  );
};
