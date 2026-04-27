import { bindersApi, bindersQK } from "../api";
import { useMutationWithToast } from "../../../hooks/useMutationWithToast";

export const useBinderMutations = (onDeleteSuccess: () => void) => {
  const deleteMutation = useMutationWithToast<void, number>({
    mutationFn: (binderId) => bindersApi.delete(binderId),
    successMessage: "הקלסר נמחק בהצלחה",
    errorMessage: "שגיאה במחיקת קלסר",
    invalidateKeys: [bindersQK.all],
    onSuccess: onDeleteSuccess,
  });

  const markReadyMutation = useMutationWithToast<
    Awaited<ReturnType<typeof bindersApi.ready>>,
    number
  >({
    mutationFn: (binderId) => bindersApi.ready(binderId),
    successMessage: "הקלסר סומן כמוכן לאיסוף",
    errorMessage: "שגיאה בסימון קלסר כמוכן",
    invalidateKeys: [bindersQK.all],
  });

  const markReadyBulkMutation = useMutationWithToast<
    Awaited<ReturnType<typeof bindersApi.markReadyBulk>>,
    { clientId: number; untilPeriodYear: number; untilPeriodMonth: number }
  >({
    mutationFn: ({ clientId, untilPeriodYear, untilPeriodMonth }) =>
      bindersApi.markReadyBulk({
        client_record_id: clientId,
        until_period_year: untilPeriodYear,
        until_period_month: untilPeriodMonth,
      }),
    successMessage: (updatedBinders) =>
      updatedBinders.length > 0
        ? `${updatedBinders.length} קלסרים סומנו כמוכנים לאיסוף`
        : "לא נמצאו קלסרים מתאימים לסימון",
    errorMessage: "שגיאה בסימון קבוצתי כמוכן",
    invalidateKeys: [bindersQK.all],
  });

  const revertReadyMutation = useMutationWithToast<
    Awaited<ReturnType<typeof bindersApi.revertReady>>,
    number
  >({
    mutationFn: (binderId) => bindersApi.revertReady(binderId),
    successMessage: "סטטוס מוכן לאיסוף בוטל",
    errorMessage: "שגיאה בביטול סטטוס מוכן",
    invalidateKeys: [bindersQK.all],
  });

  const returnBinderMutation = useMutationWithToast<
    Awaited<ReturnType<typeof bindersApi.returnBinder>>,
    { binderId: number; pickupPersonName: string }
  >({
    mutationFn: ({ binderId, pickupPersonName }) =>
      bindersApi.returnBinder(binderId, { pickup_person_name: pickupPersonName }),
    successMessage: "הקלסר הוחזר בהצלחה",
    errorMessage: "שגיאה בהחזרת קלסר",
    invalidateKeys: [bindersQK.all],
  });

  const handoverMutation = useMutationWithToast<
    Awaited<ReturnType<typeof bindersApi.handover>>,
    {
      clientId: number;
      binderIds: number[];
      receivedByName: string;
      handedOverAt: string;
      untilPeriodYear: number;
      untilPeriodMonth: number;
      notes?: string | null;
    }
  >({
    mutationFn: (payload) =>
      bindersApi.handover({
        client_record_id: payload.clientId,
        binder_ids: payload.binderIds,
        received_by_name: payload.receivedByName,
        handed_over_at: payload.handedOverAt,
        until_period_year: payload.untilPeriodYear,
        until_period_month: payload.untilPeriodMonth,
        notes: payload.notes ?? null,
      }),
    successMessage: (handover) => `בוצעה מסירה של ${handover.binder_ids.length} קלסרים`,
    errorMessage: "שגיאה במסירת קלסרים",
    invalidateKeys: [bindersQK.all],
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
