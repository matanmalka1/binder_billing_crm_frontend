import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chargesApi } from "../../../api/charges.api";
import { toast } from "../../../utils/toast";
import { getErrorMessage, getHttpStatus, isPositiveInt } from "../../../utils/utils";

export const useChargeDetailsPage = (chargeId: string | undefined, isAdvisor: boolean) => {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const chargeIdNumber = Number(chargeId || 0);
  const hasValidChargeId = isPositiveInt(chargeIdNumber);

  const chargeQuery = useQuery({
    enabled: hasValidChargeId,
    queryKey: ["charges", "detail", chargeIdNumber] as const,
    queryFn: () => chargesApi.getById(chargeIdNumber),
  });

  useEffect(() => {
    const status = getHttpStatus(chargeQuery.error);
    if (status === 403) {
      setDenied(true);
      return;
    }
    setDenied(false);
  }, [chargeQuery.error]);

  useEffect(() => {
    if (hasValidChargeId) {
      setDenied(false);
    }
  }, [chargeIdNumber, hasValidChargeId]);

  useEffect(() => {
    if (chargeQuery.isSuccess) {
      setDenied(false);
    }
  }, [chargeQuery.isSuccess]);

  const actionMutation = useMutation({
    mutationFn: async (action: "issue" | "markPaid" | "cancel") => {
      if (action === "issue") return chargesApi.issue(chargeIdNumber);
      if (action === "markPaid") return chargesApi.markPaid(chargeIdNumber);
      return chargesApi.cancel(chargeIdNumber);
    },
    onSuccess: async () => {
      toast.success("פעולת חיוב בוצעה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["charges", "detail", chargeIdNumber] }),
        queryClient.invalidateQueries({ queryKey: ["charges", "list"] }),
      ]);
    },
  });

  const runAction = async (action: "issue" | "markPaid" | "cancel") => {
    if (!hasValidChargeId || !isAdvisor) return setDenied(true);
    try {
      setActionError(null);
      setDenied(false);
      await actionMutation.mutateAsync(action);
    } catch (requestError: unknown) {
      const status = getHttpStatus(requestError);
      if (status === 403) setDenied(true);
      setActionError(getErrorMessage(requestError, "שגיאה בביצוע פעולה"));
    }
  };

  const error = useMemo(() => {
    if (!hasValidChargeId) return "מזהה חיוב חסר";
    if (actionError) return actionError;
    if (chargeQuery.error) {
      return getErrorMessage(chargeQuery.error, "שגיאה בטעינת פרטי חיוב");
    }
    return null;
  }, [actionError, chargeQuery.error, hasValidChargeId]);

  return {
    actionLoading: actionMutation.isPending,
    charge: chargeQuery.data ?? null,
    denied,
    error,
    loading: hasValidChargeId ? chargeQuery.isPending : false,
    runAction,
  };
};
