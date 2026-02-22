import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import {
  chargesApi,
  type ChargesListParams,
  type CreateChargePayload,
} from "../../../api/charges.api";
import { getErrorMessage, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toOptionalNumber, toOptionalString } from "../../../utils/filters";
import { useRole } from "../../../hooks/useRole";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";

export const useChargesPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setSearchParams } = useSearchParamFilters();

  const filters = {
    client_id: searchParams.get("client_id") ?? "",
    status: searchParams.get("status") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: ChargesListParams = {
    client_id: toOptionalNumber(filters.client_id),
    status: toOptionalString(filters.status),
    page: filters.page,
    page_size: filters.page_size,
  };

  const listQuery = useQuery({
    queryKey: QK.charges.list(apiParams),
    queryFn: () => chargesApi.list(apiParams),
  });
  const { isAdvisor } = useRole();

  const createMutation = useMutation({
    mutationFn: (payload: CreateChargePayload) => chargesApi.create(payload),
    onSuccess: async () => {
      toast.success("חיוב נוצר בהצלחה");
      await queryClient.invalidateQueries({ queryKey: QK.charges.all });
    },
  });

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const actionMutation = useMutation({
    mutationFn: async ({
      action,
      chargeId,
    }: {
      action: "issue" | "markPaid" | "cancel";
      chargeId: number;
    }) => {
      if (action === "issue") return chargesApi.issue(chargeId);
      if (action === "markPaid") return chargesApi.markPaid(chargeId);
      return chargesApi.cancel(chargeId);
    },
    onSuccess: async () => {
      toast.success("פעולת חיוב בוצעה בהצלחה");
      await queryClient.invalidateQueries({ queryKey: QK.charges.all });
    },
  });

  const runAction = useCallback(
    async (chargeId: number, action: "issue" | "markPaid" | "cancel") => {
      if (!isAdvisor) {
        toast.error("אין הרשאה לבצע פעולת חיוב זו");
        return;
      }

      try {
        setActionLoadingId(chargeId);
        await actionMutation.mutateAsync({ action, chargeId });
      } catch (requestError: unknown) {
        showErrorToast(requestError, "שגיאה בביצוע פעולת חיוב");
      } finally {
        setActionLoadingId(null);
      }
    },
    [actionMutation, isAdvisor],
  );

  // setFilter provided by useSearchParamFilters

  const submitCreate = async (
    payload: CreateChargePayload,
  ): Promise<boolean> => {
    if (!isAdvisor) {
      return false;
    }

    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (requestError: unknown) {
      showErrorToast(requestError, "שגיאה ביצירת חיוב");
      return false;
    }
  };

  return {
    actionLoadingId,
    charges: listQuery.data?.items ?? [],
    createError: createMutation.error
      ? getErrorMessage(createMutation.error, "שגיאה ביצירת חיוב")
      : null,
    createLoading: createMutation.isPending,
    error: listQuery.error
      ? getErrorMessage(listQuery.error, "שגיאה בטעינת רשימת חיובים")
      : null,
    filters,
    isAdvisor,
    loading: listQuery.isPending,
    runAction,
    setFilter,
    setSearchParams,
    submitCreate,
    total: listQuery.data?.total ?? 0,
  };
};
