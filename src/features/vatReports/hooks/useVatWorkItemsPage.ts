import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import type { VatWorkItemAction } from "../types";

export const useVatWorkItemsPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setSearchParams } = useSearchParamFilters();
  const { isAdvisor } = useRole();

  const filters = {
    status: searchParams.get("status") ?? "",
    period: searchParams.get("period") ?? "",
    clientSearch: searchParams.get("clientSearch") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: VatWorkItemsListParams = {
    status: toOptionalString(filters.status),
    page: filters.page,
    page_size: filters.page_size,
    period: toOptionalString(filters.period),
    client_name: toOptionalString(filters.clientSearch),
  };

  const { data: statsPendingData } = useQuery({
    queryKey: vatReportsQK.list({ status: "pending_materials", page: 1, page_size: 1 }),
    queryFn: () => vatReportsApi.list({ status: "pending_materials", page: 1, page_size: 1 }),
  });
  const { data: statsMaterialData } = useQuery({
    queryKey: vatReportsQK.list({ status: "material_received", page: 1, page_size: 1 }),
    queryFn: () => vatReportsApi.list({ status: "material_received", page: 1, page_size: 1 }),
  });
  const { data: statsDataEntryData } = useQuery({
    queryKey: vatReportsQK.list({ status: "data_entry_in_progress", page: 1, page_size: 1 }),
    queryFn: () => vatReportsApi.list({ status: "data_entry_in_progress", page: 1, page_size: 1 }),
  });
  const { data: statsReviewData } = useQuery({
    queryKey: vatReportsQK.list({ status: "ready_for_review", page: 1, page_size: 1 }),
    queryFn: () => vatReportsApi.list({ status: "ready_for_review", page: 1, page_size: 1 }),
  });
  const { data: statsFiledData } = useQuery({
    queryKey: vatReportsQK.list({ status: "filed", page: 1, page_size: 1 }),
    queryFn: () => vatReportsApi.list({ status: "filed", page: 1, page_size: 1 }),
  });

  const statsPending = statsPendingData?.total ?? undefined;
  const statsTyping =
    statsMaterialData !== undefined && statsDataEntryData !== undefined
      ? statsMaterialData.total + statsDataEntryData.total
      : undefined;
  const statsReview = statsReviewData?.total ?? undefined;
  const statsFiled = statsFiledData?.total ?? undefined;

  const { items: rawItems, total, loading, error } = usePaginatedList({
    queryKey: vatReportsQK.list(apiParams),
    queryFn: () => vatReportsApi.list(apiParams),
    errorMessage: 'שגיאה בטעינת תיקי מע"מ',
  });

  const workItems = rawItems;

  const createMutation = useMutation({
    mutationFn: (payload: CreateVatWorkItemPayload) => vatReportsApi.create(payload),
    onSuccess: async () => {
      toast.success('תיק מע"מ נוצר בהצלחה');
      await queryClient.invalidateQueries({ queryKey: vatReportsQK.all });
    },
  });

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const actionMutation = useMutation({
    mutationFn: ({ action, itemId }: { action: Exclude<VatWorkItemAction, "sendBack">; itemId: number }) => {
      if (action === "materialsComplete") return vatReportsApi.markMaterialsComplete(itemId);
      return vatReportsApi.markReadyForReview(itemId);
    },
    onSuccess: async () => {
      toast.success("הפעולה בוצעה בהצלחה");
      await queryClient.invalidateQueries({ queryKey: vatReportsQK.all });
    },
  });

  const sendBackMutation = useMutation({
    mutationFn: ({ itemId, note }: { itemId: number; note: string }) =>
      vatReportsApi.sendBack(itemId, note),
    onSuccess: async () => {
      toast.success("התיק הוחזר לתיקון");
      await queryClient.invalidateQueries({ queryKey: vatReportsQK.all });
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
