import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { advancePaymentsApi } from "../../../api/advancePayments.api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

export const useAdvancePayments = (clientId: number, year: number) => {
  const queryClient = useQueryClient();
  const qk = QK.tax.advancePayments.forClientYear(clientId, year);
  const enabled = clientId > 0;

  const listQuery = useQuery({
    enabled,
    queryKey: qk,
    queryFn: () =>
      advancePaymentsApi.list({ client_id: clientId, year, page_size: 12 }),
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      paid_amount?: number | null;
      status?: string;
    }) => advancePaymentsApi.update(id, payload),
    onSuccess: () => {
      toast.success("מקדמה עודכנה בהצלחה");
      queryClient.invalidateQueries({ queryKey: qk });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון מקדמה"),
  });

  const createMutation = useMutation({
    mutationFn: advancePaymentsApi.create,
    onSuccess: () => {
      toast.success("מקדמה נוצרה בהצלחה");
      queryClient.invalidateQueries({ queryKey: qk });
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת מקדמה"),
  });

  const rows = enabled ? listQuery.data?.items ?? [] : [];
  const totalExpected = enabled
    ? rows.reduce(
        (sum: number, row: (typeof rows)[number]) =>
          sum + (row.expected_amount ?? 0),
        0,
      )
    : 0;
  const totalPaid = enabled
    ? rows.reduce(
        (sum: number, row: (typeof rows)[number]) =>
          sum + (row.paid_amount ?? 0),
        0,
      )
    : 0;

  return {
    rows,
    isLoading: enabled && listQuery.isPending,
    error:
      enabled && listQuery.error
        ? getErrorMessage(listQuery.error, "שגיאה בטעינת מקדמות")
        : null,
    totalExpected,
    totalPaid,
    updateRow: (id: number, paid_amount: number | null) =>
      updateMutation.mutate({ id, paid_amount }),
    isUpdating: updateMutation.isPending,
    updatingId: updateMutation.isPending
      ? (updateMutation.variables?.id ?? null)
      : null,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};
