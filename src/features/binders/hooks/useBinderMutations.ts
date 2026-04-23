import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bindersApi, bindersQK } from "../api";
import { showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

export const useBinderMutations = (onDeleteSuccess: () => void) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (binderId: number) => bindersApi.delete(binderId),
    onSuccess: () => {
      toast.success("הקלסר נמחק בהצלחה");
      onDeleteSuccess();
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת קלסר"),
  });

  const markReadyMutation = useMutation({
    mutationFn: (binderId: number) => bindersApi.ready(binderId),
    onSuccess: () => {
      toast.success("הקלסר סומן כמוכן לאיסוף");
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בסימון קלסר כמוכן"),
  });

  const markReadyBulkMutation = useMutation({
    mutationFn: ({
      clientId,
      untilPeriodYear,
      untilPeriodMonth,
    }: {
      clientId: number;
      untilPeriodYear: number;
      untilPeriodMonth: number;
    }) =>
      bindersApi.markReadyBulk({
        client_record_id: clientId,
        until_period_year: untilPeriodYear,
        until_period_month: untilPeriodMonth,
      }),
    onSuccess: (updatedBinders) => {
      toast.success(
        updatedBinders.length > 0
          ? `${updatedBinders.length} קלסרים סומנו כמוכנים לאיסוף`
          : "לא נמצאו קלסרים מתאימים לסימון",
      );
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בסימון קבוצתי כמוכן"),
  });

  const revertReadyMutation = useMutation({
    mutationFn: (binderId: number) => bindersApi.revertReady(binderId),
    onSuccess: () => {
      toast.success("סטטוס מוכן לאיסוף בוטל");
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בביטול סטטוס מוכן"),
  });

  const returnBinderMutation = useMutation({
    mutationFn: ({ binderId, pickupPersonName }: { binderId: number; pickupPersonName: string }) =>
      bindersApi.returnBinder(binderId, { pickup_person_name: pickupPersonName }),
    onSuccess: () => {
      toast.success("הקלסר הוחזר בהצלחה");
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהחזרת קלסר"),
  });

  const handoverMutation = useMutation({
    mutationFn: (payload: {
      clientId: number;
      binderIds: number[];
      receivedByName: string;
      handedOverAt: string;
      untilPeriodYear: number;
      untilPeriodMonth: number;
      notes?: string | null;
    }) =>
      bindersApi.handover({
        client_record_id: payload.clientId,
        binder_ids: payload.binderIds,
        received_by_name: payload.receivedByName,
        handed_over_at: payload.handedOverAt,
        until_period_year: payload.untilPeriodYear,
        until_period_month: payload.untilPeriodMonth,
        notes: payload.notes ?? null,
      }),
    onSuccess: (handover) => {
      toast.success(`בוצעה מסירה של ${handover.binder_ids.length} קלסרים`);
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה במסירת קלסרים"),
  });

  const actionLoadingId =
    markReadyMutation.isPending
      ? (markReadyMutation.variables as number | undefined) ?? null
      : revertReadyMutation.isPending
      ? (revertReadyMutation.variables as number | undefined) ?? null
      : returnBinderMutation.isPending
      ? (returnBinderMutation.variables as { binderId: number } | undefined)?.binderId ?? null
      : null;

  return {
    actionLoadingId,
    deleteBinder: (binderId: number) => deleteMutation.mutateAsync(binderId),
    isDeleting: deleteMutation.isPending,
    markReady: (binderId: number) => markReadyMutation.mutateAsync(binderId),
    markReadyBulk: (clientId: number, untilPeriodYear: number, untilPeriodMonth: number) =>
      markReadyBulkMutation.mutateAsync({ clientId, untilPeriodYear, untilPeriodMonth }),
    isMarkingReadyBulk: markReadyBulkMutation.isPending,
    revertReady: (binderId: number) => revertReadyMutation.mutateAsync(binderId),
    returnBinder: (binderId: number, pickupPersonName: string) =>
      returnBinderMutation.mutateAsync({ binderId, pickupPersonName }),
    isReturning: returnBinderMutation.isPending,
    handoverBinders: (
      clientId: number,
      binderIds: number[],
      receivedByName: string,
      handedOverAt: string,
      untilPeriodYear: number,
      untilPeriodMonth: number,
      notes?: string | null,
    ) =>
      handoverMutation.mutateAsync({
        clientId,
        binderIds,
        receivedByName,
        handedOverAt,
        untilPeriodYear,
        untilPeriodMonth,
        notes,
      }),
    isHandingOver: handoverMutation.isPending,
  };
};
