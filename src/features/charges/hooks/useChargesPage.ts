import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import {
  chargesApi,
  type ChargesListParams,
  type CreateChargePayload,
} from "../../../api/charges.api";
import { useAuthStore } from "../../../store/auth.store";
import { getErrorMessage, parsePositiveInt } from "../../../utils/utils";
import { toOptionalNumber, toOptionalString } from "../../../utils/filters";

export const useChargesPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

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
    queryKey: ["charges", "list", apiParams] as const,
    queryFn: () => chargesApi.list(apiParams),
  });
  const { user } = useAuthStore();
  const isAdvisor = user?.role === "advisor";

  const createMutation = useMutation({
    mutationFn: (payload: CreateChargePayload) => chargesApi.create(payload),
    onSuccess: async () => {
      toast.success("חיוב נוצר בהצלחה");
      await queryClient.invalidateQueries({ queryKey: ["charges", "list"] });
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
      await queryClient.invalidateQueries({ queryKey: ["charges", "list"] });
    },
  });

  const runAction = async (chargeId: number, action: "issue" | "markPaid" | "cancel") => {
    if (!isAdvisor) {
      toast.error("אין הרשאה לבצע פעולת חיוב זו");
      return;
    }

    try {
      await actionMutation.mutateAsync({ action, chargeId });
    } catch (requestError: unknown) {
      toast.error(getErrorMessage(requestError, "שגיאה בביצוע פעולת חיוב"));
    }
  };

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const submitCreate = async (payload: CreateChargePayload): Promise<boolean> => {
    if (!isAdvisor) {
      return false;
    }

    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (requestError: unknown) {
      toast.error(getErrorMessage(requestError, "שגיאה ביצירת חיוב"));
      return false;
    }
  };

  return {
    actionLoadingId: actionMutation.isPending ? (actionMutation.variables?.chargeId ?? null) : null,
    charges: listQuery.data?.items ?? [],
    createError: createMutation.error
      ? getErrorMessage(createMutation.error, "שגיאה ביצירת חיוב")
      : null,
    createLoading: createMutation.isPending,
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת רשימת חיובים") : null,
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
