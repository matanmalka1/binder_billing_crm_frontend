import { useQuery } from "@tanstack/react-query";
import { annualReportsApi, annualReportsQK } from "../api";
import type { AnnualReportDetail } from "../types";
import { useReportMutations } from "./useReportMutations";
import { useReportSchedules } from "./useReportSchedules";

export const useReportDetail = (reportId: number | null, onDeleted?: () => void) => {
  const enabled = reportId !== null && reportId > 0;
  const queryKey = annualReportsQK.detail(reportId ?? 0);

  const reportQuery = useQuery<AnnualReportDetail>({
    enabled,
    queryKey,
    queryFn: () => annualReportsApi.getReport(reportId as number) as Promise<AnnualReportDetail>,
    retry: false,
  });

  const schedules = useReportSchedules(reportId);
  const mutations = useReportMutations(reportId, onDeleted);

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
