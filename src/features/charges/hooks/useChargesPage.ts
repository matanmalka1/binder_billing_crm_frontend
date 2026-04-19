import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import {
  chargesApi,
  chargesQK,
  type BulkChargeActionPayload,
  type ChargesListParams,
  type CreateChargePayload,
} from "../api";
import { getErrorMessage, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toOptionalNumber, toOptionalString } from "../../../utils/filters";
import { useRole } from "../../../hooks/useRole";
import { toast } from "../../../utils/toast";

export const useChargesPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setSearchParams } = useSearchParamFilters();

  const filters = {
    client_id: searchParams.get("client_id") ?? "",
    status: searchParams.get("status") ?? "",
    charge_type: searchParams.get("charge_type") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: ChargesListParams = {
    client_id: toOptionalNumber(filters.client_id),
    status: toOptionalString(filters.status),
    charge_type: toOptionalString(filters.charge_type),
    page: filters.page,
    page_size: filters.page_size,
  };

  const { data: listData, isPending: loading, error: listError } = useQuery({
    queryKey: chargesQK.list(apiParams),
    queryFn: () => chargesApi.list(apiParams),
  });

  const chargeItems = listData?.items ?? [];
  const total = listData?.total ?? 0;
  const defaultStat = { count: 0, amount: "0" };
  const stats = listData?.stats ?? { draft: defaultStat, issued: defaultStat, paid: defaultStat, canceled: defaultStat };
  const error = listError ? getErrorMessage(listError, "שגיאה בטעינת רשימת חיובים") : null;
  const { isAdvisor } = useRole();

  const createMutation = useMutation({
    mutationFn: (payload: CreateChargePayload) => chargesApi.create(payload),
    onSuccess: async () => {
      toast.success("חיוב נוצר בהצלחה");
      await queryClient.invalidateQueries({ queryKey: chargesQK.all });
    },
  });

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: number[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) return new Set();
      return new Set(ids);
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

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
      await queryClient.invalidateQueries({ queryKey: chargesQK.all });
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

  const runBulkAction = useCallback(
    async (action: BulkChargeActionPayload["action"], cancellationReason?: string) => {
      if (!isAdvisor || selectedIds.size === 0) return;
      setBulkLoading(true);
      try {
        const result = await chargesApi.bulkAction({
          charge_ids: Array.from(selectedIds),
          action,
          cancellation_reason: cancellationReason,
        });
        if (result.succeeded.length > 0) {
          toast.success(`${result.succeeded.length} חיובים עודכנו בהצלחה`);
        }
        if (result.failed.length > 0) {
          result.failed.forEach((f) => toast.error(`חיוב #${f.id}: ${f.error}`));
        }
        await queryClient.invalidateQueries({ queryKey: chargesQK.all });
        clearSelection();
      } catch (requestError: unknown) {
        showErrorToast(requestError, "שגיאה בביצוע פעולה מרובה");
      } finally {
        setBulkLoading(false);
      }
    },
    [isAdvisor, selectedIds, clearSelection, queryClient],
  );

  // setFilter provided by useSearchParamFilters

  const submitCreate = async (
    payload: CreateChargePayload,
  ): Promise<boolean> => {
    if (!isAdvisor) {
      toast.error("אין הרשאה ליצור חיוב");
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
    bulkLoading,
    charges: chargeItems,
    createError: createMutation.error
      ? getErrorMessage(createMutation.error, "שגיאה ביצירת חיוב")
      : null,
    createLoading: createMutation.isPending,
    error,
    filters,
    isAdvisor,
    loading,
    runAction,
    runBulkAction,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    setFilter,
    setSearchParams,
    stats,
    submitCreate,
    total,
  };
};
