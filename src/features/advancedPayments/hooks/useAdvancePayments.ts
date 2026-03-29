import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { advancePaymentsApi, advancedPaymentsQK } from "../api";
import type {
  AdvancePaymentStatus,
  CreateAdvancePaymentPayload,
} from "../types";
import { getErrorMessage, getHttpStatus, showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

interface UpdatePayload {
  id: number;
  paid_amount?: string | null;
  expected_amount?: string | null;
  status?: AdvancePaymentStatus;
}

export const useAdvancePayments = (
  businessId: number,
  year: number,
  statusFilter?: AdvancePaymentStatus[],
  page = 1,
) => {
  const queryClient = useQueryClient();
  const qk = advancedPaymentsQK.forBusinessYear(businessId, year);
  const enabled = businessId > 0;

  const listQuery = useQuery({
    enabled,
    queryKey: statusFilter?.length
      ? [...qk, { status: statusFilter, page }]
      : [...qk, page],
    queryFn: () =>
      advancePaymentsApi.list({
        business_id: businessId,
        year,
        page,
        page_size: 20,
        ...(statusFilter?.length ? { status: statusFilter } : {}),
      }),
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: UpdatePayload) =>
      advancePaymentsApi.update(businessId, id, payload),
    onSuccess: () => {
      toast.success("מקדמה עודכנה בהצלחה");
      void queryClient.invalidateQueries({ queryKey: qk });
      void queryClient.invalidateQueries({ queryKey: advancedPaymentsQK.all });
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
    mutationFn: (id: number) => advancePaymentsApi.delete(businessId, id),
    onSuccess: () => {
      toast.success("מקדמה נמחקה בהצלחה");
      void queryClient.invalidateQueries({ queryKey: qk });
      void queryClient.invalidateQueries({ queryKey: advancedPaymentsQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת מקדמה"),
  });

  const rows = enabled ? (listQuery.data?.items ?? []) : [];
  const totalExpected = rows.reduce((sum, row) => sum + Number(row.expected_amount ?? 0), 0);
  const totalPaid = rows.reduce((sum, row) => sum + Number(row.paid_amount ?? 0), 0);

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
    total: listQuery.data?.total ?? 0,
    updateRow: (id: number, paid_amount: string | null, status?: AdvancePaymentStatus, expected_amount?: string | null) =>
      updateMutation.mutate({ id, paid_amount, status, expected_amount }),
    isUpdating: updateMutation.isPending,
    updatingId,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteRow: (id: number) => deleteMutation.mutate(id),
    isDeletingId: deleteMutation.isPending ? (deleteMutation.variables ?? null) : null,
  };
};
