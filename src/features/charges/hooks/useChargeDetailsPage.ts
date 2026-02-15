import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { chargesApi, type ChargeResponse } from "../../../api/charges.api";
import { toast } from "sonner";
import { getRequestErrorMessage } from "../../../utils/utils";
import { chargesKeys } from "../queryKeys";
export const useChargeDetailsPage = (chargeId: string | undefined, isAdvisor: boolean) => {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const chargeIdNumber = Number(chargeId || 0);
  const hasValidChargeId = Number.isInteger(chargeIdNumber) && chargeIdNumber > 0;

  const chargeQuery = useQuery({
    enabled: hasValidChargeId,
    queryKey: chargesKeys.detail(chargeIdNumber),
    queryFn: () => chargesApi.getById(chargeIdNumber),
  });

  useEffect(() => {
    const status = axios.isAxiosError(chargeQuery.error)
      ? chargeQuery.error.response?.status
      : null;
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
        queryClient.invalidateQueries({ queryKey: chargesKeys.detail(chargeIdNumber) }),
        queryClient.invalidateQueries({ queryKey: chargesKeys.lists() }),
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
      const status = axios.isAxiosError(requestError)
        ? requestError.response?.status
        : null;
      if (typeof status === "number" && status === 403) setDenied(true);
      setActionError(getRequestErrorMessage(requestError, "שגיאה בביצוע פעולה"));
    }
  };

  const error = useMemo(() => {
    if (!hasValidChargeId) return "מזהה חיוב חסר";
    if (actionError) return actionError;
    if (chargeQuery.error) {
      return getRequestErrorMessage(chargeQuery.error, "שגיאה בטעינת פרטי חיוב");
    }
    return null;
  }, [actionError, chargeQuery.error, hasValidChargeId]);

  return {
    actionLoading: actionMutation.isPending,
    charge: (chargeQuery.data ?? null) as ChargeResponse | null,
    denied,
    error,
    loading: hasValidChargeId ? chargeQuery.isPending : false,
    runAction,
  };
};
