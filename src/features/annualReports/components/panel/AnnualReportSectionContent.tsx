import type { MutableRefObject } from "react";
import type { SectionKey, AnnualReportDetail } from "../../types";
import type { ReportDetailResponse, AnnualReportScheduleKey } from "../../api";
import { AnnualReportOverviewSection } from "./AnnualReportOverviewSection";
import { IncomeExpensePanel } from "../financials/IncomeExpensePanel";
import { TaxCalculationPanel } from "../tax/TaxCalculationPanel";
import { DeductionsTab } from "../tax/DeductionsTab";
// eslint-disable-next-line no-restricted-imports -- TODO Wave 4: replace with documents feature barrel
import { ClientDocumentsTab } from "../../../../features/documents/components/ClientDocumentsTab";
import { FilingTimelineTab } from "../shared/FilingTimelineTab";

interface AnnualReportSectionContentProps {
  reportId: number;
  activeSection: SectionKey;
  report: AnnualReportDetail;
  updateDetail: (payload: Partial<ReportDetailResponse>) => void;
  isUpdating: boolean;
  completeSchedule: (schedule: AnnualReportScheduleKey) => void;
  addSchedule: (schedule: AnnualReportScheduleKey, notes?: string) => void;
  isCompletingSchedule: boolean;
  isAddingSchedule: boolean;
  setIsDirty: (v: boolean) => void;
  submitRef: MutableRefObject<(() => void) | null>;
}

export const AnnualReportSectionContent = ({
  reportId,
  activeSection,
  report,
  updateDetail,
  isUpdating,
  completeSchedule,
  addSchedule,
  isCompletingSchedule,
  isAddingSchedule,
  setIsDirty,
  submitRef,
}: AnnualReportSectionContentProps) => {
  switch (activeSection) {
    case "overview":
      return (
        <AnnualReportOverviewSection
          report={report}
          detail={report}
          schedules={report.schedules ?? []}
          onDetailSave={updateDetail}
          isSaving={isUpdating}
          onScheduleComplete={completeSchedule}
          onScheduleAdd={addSchedule}
          isScheduleLoading={isCompletingSchedule}
          isScheduleAdding={isAddingSchedule}
          clientId={report.client_id}
          onDirtyChange={setIsDirty}
          submitRef={submitRef}
        />
      );
    case "financials": return <IncomeExpensePanel reportId={reportId} />;
    case "tax": return <TaxCalculationPanel reportId={reportId} />;
    case "deductions": return <DeductionsTab reportId={reportId} taxYear={report.tax_year} />;
    case "documents": return <ClientDocumentsTab clientId={report.client_id} />;
    case "timeline": return <FilingTimelineTab reports={[report]} />;
  }
};

AnnualReportSectionContent.displayName = "AnnualReportSectionContent";
