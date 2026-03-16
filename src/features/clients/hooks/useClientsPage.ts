import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { clientsApi, type BulkClientActionPayload, type ListClientsParams } from "../../../api/clients.api";
import { parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";
import { QK } from "../../../lib/queryKeys";
import type { CreateClientPayload } from "../../../api/clients.api";
import { useRole } from "../../../hooks/useRole";
import { toast } from "../../../utils/toast";

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage } = useSearchParamFilters();
  const { isAdvisor, can } = useRole();

  const filters = {
    has_signals: searchParams.get("has_signals") ?? "",
    status: searchParams.get("status") ?? "",
    search: searchParams.get("search") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: ListClientsParams = {
    has_signals: filters.has_signals ? filters.has_signals === "true" : undefined,
    status: filters.status || undefined,
    search: filters.search || undefined,
    page: filters.page,
    page_size: filters.page_size,
  };

  const { items: clientItems, total, loading, error } = usePaginatedList({
    queryKey: QK.clients.list(apiParams),
    queryFn: () => clientsApi.list(apiParams),
    errorMessage: "שגיאה בטעינת רשימת לקוחות",
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      toast.success("לקוח נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.clients.all });
    },
    onError: (err) =>
      showErrorToast(err, "שגיאה ביצירת לקוח"),
  });

  const {
    activeActionKey,
    activeActionKeyRef,
    cancelPendingAction,
    confirmPendingAction,
    handleAction: onAction,
    pendingAction,
  } = useActionRunner({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK.clients.all }),
    errorFallback: "שגיאה בביצוע פעולת לקוח",
    canonicalAction: true,
  });

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

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

  const runBulkAction = useCallback(
    async (action: BulkClientActionPayload["action"]) => {
      if (!isAdvisor || selectedIds.size === 0) return;
      setBulkLoading(true);
      try {
        const result = await clientsApi.bulkAction({
          client_ids: Array.from(selectedIds),
          action,
        });
        if (result.succeeded.length > 0) {
          toast.success(`${result.succeeded.length} לקוחות עודכנו בהצלחה`);
        }
        if (result.failed.length > 0) {
          result.failed.forEach((f) => toast.error(`לקוח #${f.id}: ${f.error}`));
        }
        await queryClient.invalidateQueries({ queryKey: QK.clients.all });
        clearSelection();
      } catch (requestError: unknown) {
        showErrorToast(requestError, "שגיאה בביצוע פעולה מרובה");
      } finally {
        setBulkLoading(false);
      }
    },
    [isAdvisor, selectedIds, clearSelection, queryClient],
  );

  const handleFilterChange = (name: "has_signals" | "status" | "page_size" | "search", value: string) => {
    setFilter(name, value);
  };

  return {
    activeActionKey,
    activeActionKeyRef,
    bulkLoading,
    clients: clientItems,
    clearSelection,
    error,
    filters,
    onAction,
    handleFilterChange,
    loading,
    pendingAction,
    runBulkAction,
    selectedIds,
    setPage,
    toggleSelect,
    toggleSelectAll,
    total,
    cancelPendingAction,
    confirmPendingAction,
    createClient: async (payload: CreateClientPayload): Promise<void> => {
      await createMutation.mutateAsync(payload);
    },
    createLoading: createMutation.isPending,
    isAdvisor,
    can,
  };
};
