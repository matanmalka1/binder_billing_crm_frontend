import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  annualReportsApi,
  type StatusTransitionPayload,
  type AnnualReportScheduleKey,
  type ReportDetailResponse,
} from "../../../api/annualReports.api";
import { showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import type { AnnualReportDetail } from "../types";

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      const clientId = reportQuery.data?.client_id;
      if (clientId) {
        void queryClient.invalidateQueries({ queryKey: QK.timeline.clientRoot(clientId) });
      }
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
    mutationFn: (payload: Partial<ReportDetailResponse>) =>
      annualReportsApi.patchReportDetails(reportId as number, payload),
    onSuccess: (updated) => {
      toast.success("דוח עודכן בהצלחה");
      // Merge updated detail fields back into the cached AnnualReportDetail
      if (qk) {
        queryClient.setQueryData<AnnualReportDetail>(qk, (prev) =>
          prev
            ? {
                ...prev,
                tax_refund_amount: updated.tax_refund_amount,
                tax_due_amount: updated.tax_due_amount,
                client_approved_at: updated.client_approved_at,
                internal_notes: updated.internal_notes,
              }
            : prev,
        );
      }
      void queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון דוח"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => annualReportsApi.deleteReport(reportId as number),
    onSuccess: async () => {
      toast.success("הדוח נמחק בהצלחה");
      await queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
      if (onDeleted) {
        onDeleted();
      } else {
        navigate("/annual-reports");
      }
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת דוח"),
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
    updateDetail: (payload: Partial<ReportDetailResponse>) => updateMutation.mutate(payload),
    isUpdating: updateMutation.isPending,
    deleteReport: () => deleteMutation.mutateAsync(),
    isDeleting: deleteMutation.isPending,
  };
};