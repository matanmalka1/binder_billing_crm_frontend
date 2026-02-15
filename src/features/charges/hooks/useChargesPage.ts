import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  chargesApi,
  type ChargeResponse,
  type ChargesListParams,
  type CreateChargePayload,
} from "../../../api/charges.api";
import { chargesKeys } from "../queryKeys";
import { useAuthStore } from "../../../store/auth.store";
import { getRequestErrorMessage } from "../../../utils/utils";
import { usePaginatedResource } from "../../../hooks/usePaginatedResource";

export const useChargesPage = () => {
  const queryClient = useQueryClient();
  const { data, total, error, loading, filters, setFilter, setSearchParams } = usePaginatedResource<
    {
      client_id: string;
      status: string;
      page: number;
      page_size: number;
    },
    ChargesListParams,
    ChargeResponse
  >({
    parseFilters: (params, page, pageSize) => ({
      client_id: params.get("client_id") ?? "",
      status: params.get("status") ?? "",
      page,
      page_size: pageSize,
    }),
    buildParams: (parsed) => ({
      client_id: parsed.client_id ? Number(parsed.client_id) : undefined,
      status: parsed.status || undefined,
      page: parsed.page,
      page_size: parsed.page_size,
    }),
    queryKey: (params) => chargesKeys.list(params),
    queryFn: (params) => chargesApi.list(params),
  });
  const { user } = useAuthStore();
  const isAdvisor = user?.role === "advisor";

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

  return {
    actionLoadingId: actionMutation.isPending ? (actionMutation.variables?.chargeId ?? null) : null,
    charges: data,
    createError: createMutation.error
      ? getRequestErrorMessage(createMutation.error, "שגיאה ביצירת חיוב")
      : null,
    createLoading: createMutation.isPending,
    error: error ? getRequestErrorMessage(error, "שגיאה בטעינת רשימת חיובים") : null,
    filters,
    isAdvisor,
    loading,
    runAction,
    setFilter,
    setSearchParams,
    submitCreate,
    total,
  };
};
