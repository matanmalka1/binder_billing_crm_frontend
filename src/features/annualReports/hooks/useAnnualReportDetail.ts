import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import {
  annualReportsApi,
  type AnnualReportFull as AnnualReportResponse,
  type StageKey,
} from "../../../api/annualReports.api";
import { showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { QK } from "../../../lib/queryKeys";

export interface AnnualReportDetail extends AnnualReportResponse {
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

export const useAnnualReportDetail = (reportId: number | null) => {
  const queryClient = useQueryClient();
  const enabled = reportId !== null && reportId > 0;
  const qk = enabled ? QK.tax.annualReports.detail(reportId) : null;

  const detailQuery = useQuery<AnnualReportDetail>({
    enabled,
    queryKey: qk ?? ["annual-reports", "detail", null],
    queryFn: () => fetchDetail(reportId as number),
    retry: false,
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
    detail: detailQuery.data ?? null,
    isLoading: detailQuery.isPending,
    error: detailQuery.error ? "שגיאה בטעינת פרטי דוח" : null,
    updateDetail: (payload: Partial<AnnualReportDetail>) => updateMutation.mutate(payload),
    isUpdating: updateMutation.isPending,
  };
};