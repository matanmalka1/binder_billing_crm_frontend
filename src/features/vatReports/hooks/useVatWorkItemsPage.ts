import { useCallback, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { vatReportsApi } from "../api";
import type {
  CreateVatWorkItemPayload,
  VatWorkItemsListParams,
} from "../api";
import { getErrorMessage, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import { toOptionalString } from "../../../utils/filters";
import { useRole } from "../../../hooks/useRole";
import { vatReportsQK } from "../api/queryKeys";
import { invalidateVatWorkItem } from "./useVatInvalidation";
import type { VatWorkItemAction } from "../types";
import { VAT_WORK_ITEMS_STATS_STATUS_GROUPS } from "../constants";
import { toOptionalVatPeriodTypeFilter, toVatPeriodTypeFilter } from "../filterUtils";

const statsStatuses = [
  ...VAT_WORK_ITEMS_STATS_STATUS_GROUPS.pending,
  ...VAT_WORK_ITEMS_STATS_STATUS_GROUPS.typing,
  ...VAT_WORK_ITEMS_STATS_STATUS_GROUPS.review,
  ...VAT_WORK_ITEMS_STATS_STATUS_GROUPS.filed,
] as const;

type VatStatsStatus = (typeof statsStatuses)[number];

export const useVatWorkItemsPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setSearchParams } = useSearchParamFilters();
  const { isAdvisor } = useRole();

  const filters = {
    status: searchParams.get("status") ?? "",
    period: searchParams.get("period") ?? "",
    period_type: toVatPeriodTypeFilter(searchParams.get("period_type")),
    clientSearch: searchParams.get("clientSearch") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: VatWorkItemsListParams = {
    status: toOptionalString(filters.status),
    page: filters.page,
    page_size: filters.page_size,
    period: toOptionalString(filters.period),
    period_type: toOptionalVatPeriodTypeFilter(filters.period_type),
    client_name: toOptionalString(filters.clientSearch),
  };

  const statsBase = {
    period: apiParams.period,
    period_type: apiParams.period_type,
    client_name: apiParams.client_name,
    page: 1,
    page_size: 1,
  };

  const statsQueries = useQueries({
    queries: statsStatuses.map((status) => ({
      queryKey: vatReportsQK.list({ ...statsBase, status }),
      queryFn: () => vatReportsApi.list({ ...statsBase, status }),
    })),
  });

  const getStatsTotal = (statuses: readonly VatStatsStatus[]) =>
    statuses.reduce<number | undefined>((sum, status) => {
      const index = statsStatuses.indexOf(status);
      const totalForStatus = statsQueries[index]?.data?.total;
      return totalForStatus === undefined || sum === undefined ? undefined : sum + totalForStatus;
    }, 0);

  const statsPending = getStatsTotal(VAT_WORK_ITEMS_STATS_STATUS_GROUPS.pending);
  const statsTyping = getStatsTotal(VAT_WORK_ITEMS_STATS_STATUS_GROUPS.typing);
  const statsReview = getStatsTotal(VAT_WORK_ITEMS_STATS_STATUS_GROUPS.review);
  const statsFiled = getStatsTotal(VAT_WORK_ITEMS_STATS_STATUS_GROUPS.filed);

  const { items: rawItems, total, loading, error } = usePaginatedList({
    queryKey: vatReportsQK.list(apiParams),
    queryFn: () => vatReportsApi.list(apiParams),
    errorMessage: 'שגיאה בטעינת תיקי מע"מ',
  });

  const workItems = rawItems;

  const createMutation = useMutation({
    mutationFn: (payload: CreateVatWorkItemPayload) => vatReportsApi.create(payload),
    onSuccess: async (workItem) => {
      toast.success('תיק מע"מ נוצר בהצלחה');
      await invalidateVatWorkItem(queryClient, {
        workItemId: workItem.id,
        clientRecordId: workItem.client_record_id,
        includeAudit: false,
      });
    },
  });

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const actionMutation = useMutation({
    mutationFn: ({ action, itemId }: { action: Exclude<VatWorkItemAction, "sendBack">; itemId: number }) => {
      if (action === "materialsComplete") return vatReportsApi.markMaterialsComplete(itemId);
      return vatReportsApi.markReadyForReview(itemId);
    },
    onSuccess: async (workItem) => {
      toast.success("הפעולה בוצעה בהצלחה");
      await invalidateVatWorkItem(queryClient, {
        workItemId: workItem.id,
        clientRecordId: workItem.client_record_id,
      });
    },
  });

  const sendBackMutation = useMutation({
    mutationFn: ({ itemId, note }: { itemId: number; note: string }) =>
      vatReportsApi.sendBack(itemId, note),
    onSuccess: async (workItem) => {
      toast.success("התיק הוחזר לתיקון");
      await invalidateVatWorkItem(queryClient, {
        workItemId: workItem.id,
        clientRecordId: workItem.client_record_id,
      });
    },
  });

  const runAction = useCallback(
    async (itemId: number, action: VatWorkItemAction) => {
      if (action === "sendBack" && !isAdvisor) {
        toast.error("פעולה זו זמינה ליועץ בלבד");
        return;
      }
      if (action === "sendBack") return; // handled by sendBackWithNote
      try {
        setActionLoadingId(itemId);
        await actionMutation.mutateAsync({ action, itemId });
      } catch (err: unknown) {
        showErrorToast(err, "שגיאה בביצוע הפעולה");
      } finally {
        setActionLoadingId(null);
      }
    },
    [actionMutation, isAdvisor],
  );

  const sendBackWithNote = useCallback(
    async (itemId: number, note: string): Promise<void> => {
      if (!isAdvisor) {
        toast.error("פעולה זו זמינה ליועץ בלבד");
        return;
      }
      try {
        setActionLoadingId(itemId);
        await sendBackMutation.mutateAsync({ itemId, note });
      } catch (err: unknown) {
        showErrorToast(err, "שגיאה בהחזרת התיק לתיקון");
      } finally {
        setActionLoadingId(null);
      }
    },
    [isAdvisor, sendBackMutation],
  );

  const submitCreate = async (payload: CreateVatWorkItemPayload): Promise<boolean> => {
    if (!isAdvisor) return false;
    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (err: unknown) {
      showErrorToast(err, 'שגיאה ביצירת תיק מע"מ');
      return false;
    }
  };

  return {
    actionLoadingId,
    workItems,
    createError: createMutation.error
      ? getErrorMessage(createMutation.error, 'שגיאה ביצירת תיק מע"מ')
      : null,
    createLoading: createMutation.isPending,
    error,
    filters,
    isAdvisor,
    loading,
    runAction,
    sendBackWithNote,
    setFilter,
    setSearchParams,
    statsFiled,
    statsPending,
    statsReview,
    statsTyping,
    submitCreate,
    total,
  };
};
