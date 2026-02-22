import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { annualReportsApi, type AnnualReportFull as AnnualReportResponse, type StageKey } from "../../../api/annualReports.api";
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

const updateDetail = async (reportId: number, payload: Partial<AnnualReportDetail>): Promise<AnnualReportDetail> => {
  const response = await api.patch<AnnualReportDetail>(ENDPOINTS.annualReportDetails(reportId), payload);
  return response.data;
};

export const useAnnualReportDetail = (reportId: number | null) => {
  const queryClient = useQueryClient();
  const qk = reportId ? QK.tax.annualReports.detail(reportId) : null;

  const detailQuery = useQuery<AnnualReportDetail>({
    enabled: reportId !== null && reportId > 0,
    queryKey: qk ?? ["annual-reports", "detail", null],
    queryFn: () => fetchDetail(reportId!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<AnnualReportDetail>) => updateDetail(reportId!, payload), // eslint-disable-line @typescript-eslint/no-non-null-assertion
    onSuccess: (updated) => {
      toast.success("דוח עודכן בהצלחה");
      if (qk) {
        queryClient.setQueryData(qk, updated);
      }
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון דוח"),
  });

  return {
    detail: detailQuery.data ?? null,
    isLoading: detailQuery.isPending,
    updateDetail: (payload: Partial<AnnualReportDetail>) => updateMutation.mutate(payload),
    isUpdating: updateMutation.isPending,
  };
};
