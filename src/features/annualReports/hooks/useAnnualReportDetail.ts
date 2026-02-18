import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../api/client";
import {
  annualReportsExtendedApi,
  type AnnualReportFull as AnnualReportResponse,
} from "../../../api/annualReports.extended.api";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";

export interface AnnualReportDetail extends AnnualReportResponse {
  tax_refund_amount: number | null;
  tax_due_amount: number | null;
  client_approved_at: string | null;
  internal_notes: string | null;
}

const fetchDetail = async (reportId: number): Promise<AnnualReportDetail> => {
  const base = await annualReportsExtendedApi.getReport(reportId);
  // Merge with extra fields (backend may extend the response)
  const ext = await api.get<Partial<AnnualReportDetail>>(`/annual-reports/${reportId}/details`).catch(() => ({ data: {} }));
  return { ...base, tax_refund_amount: null, tax_due_amount: null, client_approved_at: null, internal_notes: null, ...ext.data };
};

const updateDetail = async (reportId: number, payload: Partial<AnnualReportDetail>): Promise<AnnualReportDetail> => {
  const response = await api.patch<AnnualReportDetail>(`/annual-reports/${reportId}/details`, payload);
  return response.data;
};

export const useAnnualReportDetail = (reportId: number | null) => {
  const queryClient = useQueryClient();
  const qk = reportId ? QK.tax.annualReports.detail(reportId) : null;

  const detailQuery = useQuery({
    enabled: reportId !== null && reportId > 0,
    queryKey: qk ?? undefined,
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
    onError: (err) => toast.error(getErrorMessage(err, "שגיאה בעדכון דוח")),
  });

  return {
    detail: detailQuery.data ?? null,
    isLoading: detailQuery.isPending,
    updateDetail: (payload: Partial<AnnualReportDetail>) => updateMutation.mutate(payload),
    isUpdating: updateMutation.isPending,
  };
};
