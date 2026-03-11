import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../../../api/annualReport.api";
import { QK } from "../../../lib/queryKeys";
import type { AnnualReportDetail } from "../types";
import { useReportMutations } from "./useReportMutations";
import { useReportSchedules } from "./useReportSchedules";

// Fetch base report + detail record in parallel, merge into AnnualReportDetail
const fetchDetail = async (reportId: number): Promise<AnnualReportDetail> => {
  const [base, detail] = await Promise.all([
    annualReportsApi.getReport(reportId),
    annualReportsApi.getReportDetails(reportId),
  ]);
  return {
    ...base,
    tax_refund_amount: detail.tax_refund_amount,
    tax_due_amount: detail.tax_due_amount,
    client_approved_at: detail.client_approved_at,
    internal_notes: detail.internal_notes,
  };
};

export const useReportDetail = (reportId: number | null, onDeleted?: () => void) => {
  const enabled = reportId !== null && reportId > 0;
  const queryKey = QK.tax.annualReports.detail(reportId ?? 0);

  const reportQuery = useQuery<AnnualReportDetail>({
    enabled,
    queryKey,
    queryFn: () => fetchDetail(reportId as number),
    retry: false,
  });

  const schedules = useReportSchedules(reportId);
  const mutations = useReportMutations(reportId, reportQuery.data ?? null, onDeleted);

  return {
    report: reportQuery.data ?? null,
    isLoading: reportQuery.isPending,
    error: reportQuery.error ? "שגיאה בטעינת דוח" : null,
    transition: mutations.transition,
    isTransitioning: mutations.isTransitioning,
    completeSchedule: schedules.completeSchedule,
    addSchedule: schedules.addSchedule,
    isCompletingSchedule: schedules.isCompletingSchedule,
    isAddingSchedule: schedules.isAddingSchedule,
    updateDetail: mutations.updateDetail,
    isUpdating: mutations.isUpdating,
    deleteReport: mutations.deleteReport,
    isDeleting: mutations.isDeleting,
  };
};
