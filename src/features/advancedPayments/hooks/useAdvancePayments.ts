import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { advancePaymentsApi } from "../../../api/advancePayments.api";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

export const useAdvancePayments = (clientId: number, year: number) => {
  const queryClient = useQueryClient();
  const qk = ["advance-payments", clientId, year] as const;
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
    onError: (err) => toast.error(getErrorMessage(err, "שגיאה בעדכון מקדמה")),
  });

  const rows = listQuery.data?.items ?? [];
  const totalExpected = rows.reduce(
    (sum: number, row: (typeof rows)[number]) =>
      sum + (row.expected_amount ?? 0),
    0,
  );
  const totalPaid = rows.reduce(
    (sum: number, row: (typeof rows)[number]) => sum + (row.paid_amount ?? 0),
    0,
  );

  return {
    rows,
    isLoading: listQuery.isPending,
    error: listQuery.error
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
  };
};
