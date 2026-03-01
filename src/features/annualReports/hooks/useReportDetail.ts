import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  annualReportsApi,
  type AnnualReportFull,
  type StatusTransitionPayload,
  type AnnualReportScheduleKey,
  type StageKey,
} from "../../../api/annualReports.api";
import { api } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

export interface AnnualReportDetail extends AnnualReportFull {
  tax_refund_amount: number | null;
  tax_due_amount: number | null;
  client_approved_at: string | null;
  internal_notes: string | null;
  stage?: StageKey;
  due_date?: string | null;
}

const fetchDetail = async (reportId: number): Promise<AnnualReportDetail> => {
  const base = await annualReportsApi.getReport(reportId);
  return {
    tax_refund_amount: null,
    tax_due_amount: null,
    client_approved_at: null,
    internal_notes: null,
    ...base,
  };
};

const patchDetail = async (
  reportId: number,
  payload: Partial<AnnualReportDetail>,
): Promise<AnnualReportDetail> => {
  const response = await api.patch<AnnualReportDetail>(
    ENDPOINTS.annualReportDetails(reportId),
    payload,
  );
  return response.data;
};

export const useReportDetail = (reportId: number | null) => {
  const queryClient = useQueryClient();
  const enabled = reportId !== null && reportId > 0;
  const qk = enabled ? QK.tax.annualReports.detail(reportId) : null;

  const reportQuery = useQuery<AnnualReportDetail>({
    enabled,
    queryKey: qk ?? ["annual-reports", "detail", null],
    queryFn: () => fetchDetail(reportId as number),
    retry: false,
  });

  const transitionMutation = useMutation({
    mutationFn: (payload: StatusTransitionPayload) =>
      annualReportsApi.transitionStatus(reportId as number, payload),
    onSuccess: () => {
      toast.success("סטטוס עודכן בהצלחה");
      if (qk) void queryClient.invalidateQueries({ queryKey: qk });
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

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<AnnualReportDetail>) =>
      patchDetail(reportId as number, payload),
    onSuccess: (updated) => {
      toast.success("דוח עודכן בהצלחה");
      if (qk) queryClient.setQueryData(qk, updated);
      void queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון דוח"),
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
    updateDetail: (payload: Partial<AnnualReportDetail>) => updateMutation.mutate(payload),
    isUpdating: updateMutation.isPending,
  };
};