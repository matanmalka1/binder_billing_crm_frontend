import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  annualReportsApi,
  type AnnualReportFull,
  type StatusTransitionPayload,
  type AnnualReportScheduleKey,
} from "../../../api/annualReports.api";
import { showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

export const useReportDetail = (reportId: number | null) => {
  const queryClient = useQueryClient();
  const enabled = reportId !== null && reportId > 0;
  const qk = enabled ? QK.tax.annualReports.detail(reportId) : null;

  const reportQuery = useQuery<AnnualReportFull>({
    enabled,
    queryKey: qk ?? ["annual-reports", "detail", null],
    queryFn: () => annualReportsApi.getReport(reportId as number),
    retry: false,
  });

  const transitionMutation = useMutation({
    mutationFn: (payload: StatusTransitionPayload) =>
      annualReportsApi.transitionStatus(reportId as number, payload),
    onSuccess: (updated: AnnualReportFull) => {
      toast.success("סטטוס עודכן בהצלחה");
      if (qk) queryClient.setQueryData(qk, updated);
      void queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון סטטוס"),
  });

  const completeScheduleMutation = useMutation({
    mutationFn: (schedule: AnnualReportScheduleKey) =>
      annualReportsApi.completeSchedule(reportId as number, schedule),
    onSuccess: () => {
      toast.success("נספח סומן כהושלם");
      if (qk) void queryClient.invalidateQueries({ queryKey: qk });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון נספח"),
  });

  return {
    report: reportQuery.data ?? null,
    isLoading: reportQuery.isPending,
    error: reportQuery.error ? "שגיאה בטעינת דוח" : null,
    transition: (payload: StatusTransitionPayload) => transitionMutation.mutate(payload),
    isTransitioning: transitionMutation.isPending,
    completeSchedule: (schedule: AnnualReportScheduleKey) =>
      completeScheduleMutation.mutate(schedule),
    isCompletingSchedule: completeScheduleMutation.isPending,
  };
};