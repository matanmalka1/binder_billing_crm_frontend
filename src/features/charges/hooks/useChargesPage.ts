import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  chargesApi,
  type ChargeResponse,
  type ChargesListParams,
  type CreateChargePayload,
} from "../../../api/charges.api";
import { chargesKeys } from "../queryKeys";
import { useAuthStore } from "../../../store/auth.store";
import { getRequestErrorMessage } from "../../../utils/errorHandler";
import { parsePositiveInt } from "../../../utils/number";
import type { ChargesFilters } from "../types";

export const useChargesPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const isAdvisor = user?.role === "advisor";

  const filters = useMemo<ChargesFilters>(
    () => ({
      client_id: searchParams.get("client_id") ?? "",
      status: searchParams.get("status") ?? "",
      page: parsePositiveInt(searchParams.get("page"), 1),
      page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    }),
    [searchParams],
  );

  const listParams = useMemo<ChargesListParams>(
    () => ({
      client_id: filters.client_id ? Number(filters.client_id) : undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.page_size,
    }),
    [filters.client_id, filters.page, filters.page_size, filters.status],
  );

  const chargesQuery = useQuery({
    queryKey: chargesKeys.list(listParams),
    queryFn: () => chargesApi.list(listParams),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateChargePayload) => chargesApi.create(payload),
    onSuccess: async () => {
      toast.success("חיוב נוצר בהצלחה");
      await queryClient.invalidateQueries({ queryKey: chargesKeys.lists() });
    },
  });

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
      await queryClient.invalidateQueries({ queryKey: chargesKeys.lists() });
    },
  });

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  };

  const runAction = async (chargeId: number, action: "issue" | "markPaid" | "cancel") => {
    if (!isAdvisor) {
      toast.error("אין הרשאה לבצע פעולת חיוב זו");
      return;
    }

    try {
      await actionMutation.mutateAsync({ action, chargeId });
    } catch (requestError: unknown) {
      toast.error(getRequestErrorMessage(requestError, "שגיאה בביצוע פעולת חיוב"));
    }
  };

  const submitCreate = async (payload: CreateChargePayload): Promise<boolean> => {
    if (!isAdvisor) {
      return false;
    }

    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (requestError: unknown) {
      toast.error(getRequestErrorMessage(requestError, "שגיאה ביצירת חיוב"));
      return false;
    }
  };

  const error =
    chargesQuery.error
      ? getRequestErrorMessage(chargesQuery.error, "שגיאה בטעינת רשימת חיובים")
      : null;

  return {
    actionLoadingId: actionMutation.isPending ? (actionMutation.variables?.chargeId ?? null) : null,
    charges: (chargesQuery.data?.items ?? []) as ChargeResponse[],
    createError: createMutation.error
      ? getRequestErrorMessage(createMutation.error, "שגיאה ביצירת חיוב")
      : null,
    createLoading: createMutation.isPending,
    error,
    filters,
    isAdvisor,
    loading: chargesQuery.isPending,
    runAction,
    setFilter,
    setSearchParams,
    submitCreate,
    total: chargesQuery.data?.total ?? 0,
  };
};
