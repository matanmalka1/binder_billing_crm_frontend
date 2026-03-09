import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { advancePaymentsApi } from "../../../api/advancePayments.api";
import type {
  AdvancePaymentStatus,
  CreateAdvancePaymentPayload,
} from "../../../api/advancePayments.api";
import { getErrorMessage, getHttpStatus, showErrorToast } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

interface UpdatePayload {
  id: number;
  paid_amount?: number | null;
  expected_amount?: number | null;
  status?: AdvancePaymentStatus;
}

export const useAdvancePayments = (
  clientId: number,
  year: number,
  statusFilter?: AdvancePaymentStatus[],
) => {
  const queryClient = useQueryClient();
  const qk = QK.tax.advancePayments.forClientYear(clientId, year);
  const enabled = clientId > 0;

  const listQuery = useQuery({
    enabled,
    queryKey: statusFilter?.length
      ? [...qk, { status: statusFilter }]
      : qk,
    queryFn: () =>
      advancePaymentsApi.list({
        client_id: clientId,
        year,
        page_size: 12,
        ...(statusFilter?.length ? { status: statusFilter } : {}),
      }),
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: UpdatePayload) =>
      advancePaymentsApi.update(id, payload),
    onSuccess: () => {
      toast.success("מקדמה עודכנה בהצלחה");
      void queryClient.invalidateQueries({ queryKey: qk });
      void queryClient.invalidateQueries({ queryKey: QK.tax.advancePayments.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון מקדמה"),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdvancePaymentPayload) =>
      advancePaymentsApi.create(payload),
    onSuccess: () => {
      toast.success("מקדמה נוצרה בהצלחה");
      void queryClient.invalidateQueries({ queryKey: qk });
    },
    onError: (err) => {
      if (getHttpStatus(err) === 409) {
        toast.error("מקדמה לחודש זה כבר קיימת");
      } else {
        showErrorToast(err, "שגיאה ביצירת מקדמה");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => advancePaymentsApi.delete(id),
    onSuccess: () => {
      toast.success("מקדמה נמחקה בהצלחה");
      void queryClient.invalidateQueries({ queryKey: qk });
      void queryClient.invalidateQueries({ queryKey: QK.tax.advancePayments.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת מקדמה"),
  });

  const rows = enabled ? (listQuery.data?.items ?? []) : [];
  const totalExpected = rows.reduce((sum, row) => sum + (row.expected_amount ?? 0), 0);
  const totalPaid = rows.reduce((sum, row) => sum + (row.paid_amount ?? 0), 0);

  const updatingId = updateMutation.isPending
    ? (updateMutation.variables?.id ?? null)
    : null;

  return {
    rows,
    isLoading: enabled && listQuery.isPending,
    error: enabled && listQuery.error
      ? getErrorMessage(listQuery.error, "שגיאה בטעינת מקדמות")
      : null,
    totalExpected,
    totalPaid,
    updateRow: (id: number, paid_amount: number | null, status?: AdvancePaymentStatus, expected_amount?: number | null) =>
      updateMutation.mutate({ id, paid_amount, status, expected_amount }),
    isUpdating: updateMutation.isPending,
    updatingId,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteRow: (id: number) => deleteMutation.mutate(id),
    isDeletingId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
  };
};