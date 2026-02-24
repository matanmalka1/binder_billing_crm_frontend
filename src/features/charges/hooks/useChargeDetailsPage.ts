import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chargesApi } from "../../../api/charges.api";
import { toast } from "../../../utils/toast";
import { getErrorMessage, getHttpStatus, isPositiveInt } from "../../../utils/utils";
import { QK } from "../../../lib/queryKeys";
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
    queryKey: QK.charges.detail(chargeIdNumber),
    queryFn: () => chargesApi.getById(chargeIdNumber),
    select: (data) => { setDenied(false); return data; },
  });

  // Reflect 403 from query into denied state
  const queryDenied = getHttpStatus(chargeQuery.error) === 403;

  const actionMutation = useMutation({
    mutationFn: (action: "issue" | "markPaid" | "cancel") => {
      if (action === "issue") return chargesApi.issue(chargeIdNumber);
      if (action === "markPaid") return chargesApi.markPaid(chargeIdNumber);
      return chargesApi.cancel(chargeIdNumber);
    },
    onSuccess: async () => {
      toast.success("פעולת חיוב בוצעה בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QK.charges.detail(chargeIdNumber) }),
        queryClient.invalidateQueries({ queryKey: QK.charges.all }),
      ]);
    },
  });

  const runAction = async (action: "issue" | "markPaid" | "cancel") => {
    if (!hasValidChargeId || !isAdvisor) {
      setDenied(true);
      return;
    }
    try {
      setActionError(null);
      setDenied(false);
      await actionMutation.mutateAsync(action);
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
    isAdvisor,
  };
};