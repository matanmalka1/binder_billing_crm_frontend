import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  annualReportsExtendedApi,
  type AnnualReportFull,
  type StatusTransitionPayload,
  type AnnualReportScheduleKey,
} from "../../../api/annualReports.extended.api";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

export const useReportDetail = (reportId: number | null) => {
  const queryClient = useQueryClient();
  const qk = ["tax", "annual-reports", "detail-full", reportId] as const;

  const reportQuery = useQuery({
    enabled: reportId !== null && reportId > 0,
    queryKey: qk,
    queryFn: () => annualReportsExtendedApi.getReport(reportId!),
    retry: false,
  });

  const transitionMutation = useMutation({
    mutationFn: (payload: StatusTransitionPayload) =>
      annualReportsExtendedApi.transitionStatus(reportId!, payload),
    onSuccess: (updated: AnnualReportFull) => {
      toast.success("סטטוס עודכן בהצלחה");
      queryClient.setQueryData(qk, updated);
      queryClient.invalidateQueries({ queryKey: ["tax", "annual-reports"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "שגיאה בעדכון סטטוס")),
  });

  const completeScheduleMutation = useMutation({
    mutationFn: (schedule: AnnualReportScheduleKey) =>
      annualReportsExtendedApi.completeSchedule(reportId!, schedule),
    onSuccess: () => {
      toast.success("נספח סומן כהושלם");
      queryClient.invalidateQueries({ queryKey: qk });
    },
    onError: (err) => toast.error(getErrorMessage(err, "שגיאה בעדכון נספח")),
  });

  return {
    report: reportQuery.data ?? null,
    isLoading: reportQuery.isPending,
    transition: (payload: StatusTransitionPayload) => transitionMutation.mutate(payload),
    isTransitioning: transitionMutation.isPending,
    completeSchedule: (schedule: AnnualReportScheduleKey) =>
      completeScheduleMutation.mutate(schedule),
    isCompletingSchedule: completeScheduleMutation.isPending,
  };
};
