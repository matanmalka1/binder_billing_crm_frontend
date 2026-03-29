import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chargesApi, chargesQK } from "../api";
import { toast } from "../../../utils/toast";
import { getErrorMessage, getHttpStatus, isPositiveInt, showErrorToast } from "../../../utils/utils";
import { useRole } from "../../../hooks/useRole";

export const useChargeDetailsPage = (chargeId: string | undefined) => {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);

  const chargeIdNumber = Number(chargeId || 0);
  const hasValidChargeId = isPositiveInt(chargeIdNumber);
  const { isAdvisor } = useRole();

  const chargeQuery = useQuery({
    enabled: hasValidChargeId,
    queryKey: chargesQK.detail(chargeIdNumber),
    queryFn: () => chargesApi.getById(chargeIdNumber),
  });

  // Reflect 403 from query into denied state
  const queryDenied = getHttpStatus(chargeQuery.error) === 403;

  const actionMutation = useMutation({
    mutationFn: ({ action, reason }: { action: "issue" | "markPaid" | "cancel"; reason?: string }) => {
      if (action === "issue") return chargesApi.issue(chargeIdNumber);
      if (action === "markPaid") return chargesApi.markPaid(chargeIdNumber);
      return chargesApi.cancel(chargeIdNumber, reason);
    },
    onSuccess: async () => {
      toast.success("פעולת חיוב בוצעה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chargesQK.detail(chargeIdNumber) }),
        queryClient.invalidateQueries({ queryKey: chargesQK.all }),
      ]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => chargesApi.delete(chargeIdNumber),
    onSuccess: async () => {
      toast.success("החיוב נמחק בהצלחה");
      await queryClient.invalidateQueries({ queryKey: chargesQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת חיוב"),
  });

  const runAction = async (action: "issue" | "markPaid" | "cancel", reason?: string) => {
    if (!hasValidChargeId || !isAdvisor) {
      setDenied(true);
      return;
    }
    try {
      setActionError(null);
      setDenied(false);
      await actionMutation.mutateAsync({ action, reason });
    } catch (err: unknown) {
      if (getHttpStatus(err) === 403) setDenied(true);
      setActionError(getErrorMessage(err, "שגיאה בביצוע פעולה"));
    }
  };

  const error = useMemo(() => {
    if (!hasValidChargeId) return "מזהה חיוב חסר";
    if (actionError) return actionError;
    if (chargeQuery.error) return getErrorMessage(chargeQuery.error, "שגיאה בטעינת פרטי חיוב");
    return null;
  }, [actionError, chargeQuery.error, hasValidChargeId]);

  return {
    actionLoading: actionMutation.isPending,
    charge: chargeQuery.data ?? null,
    denied: denied || queryDenied,
    error,
    loading: hasValidChargeId ? chargeQuery.isPending : false,
    runAction,
    deleteCharge: () => deleteMutation.mutateAsync(),
    isDeleting: deleteMutation.isPending,
    isAdvisor,
  };
};
