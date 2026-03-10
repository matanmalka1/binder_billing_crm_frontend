import { DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { DescriptionList } from "../../../components/ui/DescriptionList";
import { ScheduleChecklist } from "./ScheduleChecklist";
import { StatusTransitionPanel } from "./StatusTransitionPanel";
import { AnnualReportDetailForm } from "./AnnualReportDetailForm";
import { StatusHistoryTimeline } from "./StatusHistoryTimeline";
import { IncomeExpensePanel } from "./IncomeExpensePanel";
import { ReadinessCheckPanel } from "./ReadinessCheckPanel";
import { TaxCalculationPanel } from "./TaxCalculationPanel";
import { FinalBalancePanel } from "./FinalBalancePanel";
import { DeadlineUpdatePanel } from "./DeadlineUpdatePanel";
import { ReportAlertBanners } from "./ReportAlertBanners";
import { ReportHistoryTable } from "./ReportHistoryTable";
import { DeductionsTab } from "./DeductionsTab";
import { FilingTimelineTab } from "./FilingTimelineTab";
import { DocumentsTab } from "./DocumentsTab";
import { AnnualPLSummary } from "./AnnualPLSummary";
import {
  getStatusLabel,
  getStatusVariant,
  getClientTypeLabel,
} from "../../../api/annualReports.extended.utils";
import { getDeadlineTypeLabel } from "../../../api/taxDeadlines.utils";
import { formatDate } from "../../../utils/utils";
import type { AnnualReportDetail } from "../types";
import type { StatusTransitionPayload, ReportDetailResponse, AnnualReportScheduleKey } from "../../../api/annualReports.api";
import type { DetailTab } from "./AnnualReportDetailDrawer";
import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";

interface Props {
  activeTab: DetailTab;
  report: AnnualReportDetail;
  transition: (payload: StatusTransitionPayload) => void;
  isTransitioning: boolean;
  completeSchedule: (schedule: AnnualReportScheduleKey) => void;
  isCompletingSchedule: boolean;
  updateDetail: (payload: Partial<ReportDetailResponse>) => void;
  isUpdating: boolean;
  onSelectReport: (id: number) => void;
}

export const ReportDetailTabs: React.FC<Props> = ({
  activeTab,
  report,
  transition,
  isTransitioning,
  completeSchedule,
  isCompletingSchedule,
  updateDetail,
  isUpdating,
  onSelectReport,
}) => {
  const advancesQ = useQuery({
    queryKey: QK.tax.annualReportAdvancesSummary(report.id),
    queryFn: () => annualReportsApi.getAdvancesSummary(report.id),
    enabled: activeTab === "overview" || activeTab === "tax",
  });

  const baseDetails = [
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
  ];

  if (activeTab === "overview") {
    return (
      <div className="space-y-4">
        {/* Alert banners */}
        <ReportAlertBanners
          report={report}
          advances={
            advancesQ.data
              ? {
                  balance_type: advancesQ.data.balance_type,
                  final_balance: advancesQ.data.final_balance,
                }
              : undefined
          }
        />

        {/* Status badges */}
        <DrawerSection title="סטטוס">
          <div className="flex flex-wrap gap-2 py-2">
            <Badge variant={getStatusVariant(report.status)}>{getStatusLabel(report.status)}</Badge>
            <Badge variant="neutral">שנת מס {report.tax_year}</Badge>
            <Badge variant="info">{getClientTypeLabel(report.client_type)}</Badge>
            <Badge variant="neutral">{report.form_type}</Badge>
          </div>
        </DrawerSection>

        {/* Details */}
        <DrawerSection title="פרטים">
          <div className="py-2">
            <DescriptionList columns={1} items={baseDetails} />
          </div>
        </DrawerSection>

        {/* Deadline */}
        <DrawerSection title="מועד הגשה">
          <div className="py-2">
            <DeadlineUpdatePanel
              reportId={report.id}
              deadlineType={report.deadline_type}
              filingDeadline={report.filing_deadline}
            />
          </div>
        </DrawerSection>

        {/* Schedules */}
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

        {/* Readiness */}
        <DrawerSection title="מוכנות להגשה">
          <div className="py-2">
            <ReadinessCheckPanel reportId={report.id} />
          </div>
        </DrawerSection>

        {/* Status transition */}
        <DrawerSection title="מעבר סטטוס">
          <div className="py-2">
            <StatusTransitionPanel
              report={report}
              onTransition={transition}
              isLoading={isTransitioning}
            />
          </div>
        </DrawerSection>

        {/* Detail form */}
        <DrawerSection title="עדכון פרטי דוח">
          <div className="py-2">
            <AnnualReportDetailForm
              detail={report}
              onSave={updateDetail}
              isSaving={isUpdating}
            />
          </div>
        </DrawerSection>

        {/* P&L summary + trend */}
        <AnnualPLSummary reportId={report.id} clientId={report.client_id} />

        {/* History table */}
        <DrawerSection title="היסטוריית דוחות שנתיים">
          <div className="py-2">
            <ReportHistoryTable
              clientId={report.client_id}
              currentReportId={report.id}
              onSelect={onSelectReport}
            />
          </div>
        </DrawerSection>

        {/* Status history */}
        <DrawerSection title="היסטוריית סטטוסים">
          <div className="py-2">
            <StatusHistoryTimeline history={report.status_history ?? []} />
          </div>
        </DrawerSection>
      </div>
    );
  }

  if (activeTab === "financials") {
    return (
      <div className="space-y-4">
        <IncomeExpensePanel reportId={report.id} />
      </div>
    );
  }

  if (activeTab === "tax") {
    return (
      <div className="space-y-4">
        <DrawerSection title="חישוב מס">
          <div className="py-2">
            <TaxCalculationPanel reportId={report.id} />
          </div>
        </DrawerSection>
        <DrawerSection title="סיכום חבויות">
          <div className="py-2">
            <FinalBalancePanel reportId={report.id} />
          </div>
        </DrawerSection>
      </div>
    );
  }

  if (activeTab === "deductions") {
    return <DeductionsTab reportId={report.id} />;
  }

  if (activeTab === "timeline") {
    return <FilingTimelineTab reports={[report]} />;
  }

  if (activeTab === "documents") {
    return <DocumentsTab clientId={report.client_id} />;
  }

  return null;
};
