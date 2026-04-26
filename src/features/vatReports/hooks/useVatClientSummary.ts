import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vatReportsApi, type CreateVatWorkItemPayload } from "../api";
import { vatReportsQK } from "../api/queryKeys";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";

export const useVatClientSummary = (clientId: number) => {
  const queryClient = useQueryClient();

  const summaryQuery = useQuery({
    queryKey: vatReportsQK.clientSummary(clientId),
    queryFn: () => vatReportsApi.getClientSummary(clientId),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateVatWorkItemPayload) => vatReportsApi.create(payload),
    onSuccess: () => {
      toast.success('תיק מע"מ נוצר בהצלחה');
      queryClient.invalidateQueries({ queryKey: vatReportsQK.clientSummary(clientId) });
    },
    onError: (err) => showErrorToast(err, 'שגיאה ביצירת תיק מע"מ'),
  });

  return {
    data: summaryQuery.data,
    isLoading: summaryQuery.isLoading,
    error: summaryQuery.error,
    createMutation,
  };
};
