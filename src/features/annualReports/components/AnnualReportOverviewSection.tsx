import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ReportAlertBanners } from "./ReportAlertBanners";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportMetaGrid } from "./ReportMetaGrid";
import { AnnualReportDetailForm } from "./AnnualReportDetailForm";
import { ScheduleChecklist } from "./ScheduleChecklist";
import { AnnualPLSummary } from "./AnnualPLSummary";
import { ReportHistoryTable } from "./ReportHistoryTable";
import { StatusHistoryTimeline } from "./StatusHistoryTimeline";
import { annualReportsApi } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";
import type { AnnualReportDetail } from "../types";
import type { AnnualReportFull, AnnualReportScheduleKey, ScheduleEntry } from "../../../api/annualReports.api";

interface Props {
  report: AnnualReportFull;
  detail: AnnualReportDetail | null;
  advances?: { balance_type: "due" | "refund" | "zero"; final_balance: number };
  schedules: ScheduleEntry[];
  onDetailSave: (data: Partial<AnnualReportDetail>) => void;
  isSaving: boolean;
  onScheduleComplete: (schedule: AnnualReportScheduleKey) => void;
  isScheduleLoading: boolean;
  completingKey?: AnnualReportScheduleKey | null;
  clientId: number;
  onSelectReport?: (reportId: number) => void;
  onDirtyChange?: (dirty: boolean) => void;
  submitRef?: React.RefObject<(() => void) | null>;
}

export const AnnualReportOverviewSection: React.FC<Props> = ({
  report,
  detail,
  advances,
  schedules,
  onDetailSave,
  isSaving,
  onScheduleComplete,
  isScheduleLoading,
  completingKey,
  clientId,
  onSelectReport,
  onDirtyChange,
  submitRef,
}) => {
  const [plExpanded, setPlExpanded] = useState(false);

  const { data: history } = useQuery({
    queryKey: QK.tax.annualReports.statusHistory(report.id),
    queryFn: () => annualReportsApi.getHistory(report.id),
    enabled: !!report.id,
  });

  return (
    <div className="space-y-6">
      {/* 1. Alert banners */}
      <ReportAlertBanners report={detail ?? ({} as AnnualReportDetail)} advances={advances} />

      {/* 2. Summary cards */}
      <ReportSummaryCards reportId={report.id} />

      {/* 3. Two-column grid: meta + detail form */}
      <div className="grid grid-cols-2 gap-6">
        <ReportMetaGrid report={report} />
        <AnnualReportDetailForm
          detail={detail}
          onSave={onDetailSave}
          isSaving={isSaving}
          onDirtyChange={onDirtyChange}
          submitRef={submitRef}
        />
      </div>

      {/* 4. Schedule checklist */}
      <ScheduleChecklist
        reportId={report.id}
        schedules={schedules}
        onComplete={onScheduleComplete}
        isLoading={isScheduleLoading}
        completingKey={completingKey}
      />

      {/* 5. P&L summary — collapsible, collapsed by default */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => setPlExpanded((prev) => !prev)}
        >
          <span>סיכום רווח והפסד</span>
          {plExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {plExpanded && (
          <div className="border-t border-gray-100 px-4 pb-4 pt-2">
            <AnnualPLSummary reportId={report.id} clientId={clientId} />
          </div>
        )}
      </div>

      {/* 6. Report history table */}
      <ReportHistoryTable
        clientId={clientId}
        currentReportId={report.id}
        onSelect={onSelectReport}
      />

      {/* 7. Status history timeline */}
      <StatusHistoryTimeline history={history ?? []} />
    </div>
  );
};

AnnualReportOverviewSection.displayName = "AnnualReportOverviewSection";
