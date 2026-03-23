import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import {
  clientsApi,
  type BulkClientActionPayload,
  type CreateClientPayload,
  type DeletedClientInfo,
  type ListClientsParams,
} from "../api";
import { parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { useActionRunner } from "@/features/actions";
import { QK } from "../../../lib/queryKeys";
import { useRole } from "../../../hooks/useRole";
import { toast } from "../../../utils/toast";
import axios from "axios";

/** Extract the application-level error code from an Axios error response. */
const extractErrorCode = (err: unknown): string | null => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.response?.data?.code ?? null;
  }
  return null;
};

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage } = useSearchParamFilters();
  const { isAdvisor, can } = useRole();

  // Pending payload held while the "deleted client" dialog is open.
  const [pendingCreatePayload, setPendingCreatePayload] =
    useState<CreateClientPayload | null>(null);
  const [deletedClientInfo, setDeletedClientInfo] =
    useState<DeletedClientInfo | null>(null);

  const filters = {
    has_signals: searchParams.get("has_signals") ?? "",
    status: searchParams.get("status") ?? "",
    search: searchParams.get("search") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: ListClientsParams = {
    has_signals: filters.has_signals
      ? filters.has_signals === "true"
      : undefined,
    status: filters.status || undefined,
    search: filters.search || undefined,
    page: filters.page,
    page_size: filters.page_size,
  };

  const {
    items: clientItems,
    total,
    loading,
    error,
  } = usePaginatedList({
    queryKey: QK.clients.list(apiParams),
    queryFn: () => clientsApi.list(apiParams),
    errorMessage: "שגיאה בטעינת רשימת לקוחות",
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      toast.success("לקוח נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.clients.all });
      setPendingCreatePayload(null);
      setDeletedClientInfo(null);
    },
    onError: async (err, payload) => {
      const code = extractErrorCode(err);
      if (code === "CLIENT.DELETED_EXISTS") {
        try {
          const deleted = await clientsApi.getDeletedByIdNumber(
            payload.id_number,
          );
          setDeletedClientInfo(deleted);
          setPendingCreatePayload(payload);
        } catch {
          showErrorToast(err, "שגיאה ביצירת לקוח");
        }
      } else {
        showErrorToast(err, "שגיאה ביצירת לקוח");
      }
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (clientId: number) => clientsApi.restore(clientId),
    onSuccess: () => {
      toast.success("הלקוח שוחזר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.clients.all });
      setPendingCreatePayload(null);
      setDeletedClientInfo(null);
    },
    onError: (err) => showErrorToast(err, "שגיאה בשחזור לקוח"),
  });

  const handleRestoreClient = useCallback(() => {
    if (!deletedClientInfo) return;
    restoreMutation.mutate(deletedClientInfo.id);
  }, [deletedClientInfo, restoreMutation]);

  const handleForceCreate = useCallback(() => {
    if (!pendingCreatePayload) return;
    createMutation.mutate({ ...pendingCreatePayload, force: true });
  }, [pendingCreatePayload, createMutation]);

  const handleDismissDeletedDialog = useCallback(() => {
    setPendingCreatePayload(null);
    setDeletedClientInfo(null);
  }, []);

  const {
    activeActionKey,
    activeActionKeyRef,
    cancelPendingAction,
    confirmPendingAction,
    handleAction: onAction,
    pendingAction,
  } = useActionRunner({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QK.clients.all }),
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
          result.failed.forEach((f) =>
            toast.error(`לקוח #${f.id}: ${f.error}`),
          );
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

  const handleFilterChange = (
    name: "has_signals" | "status" | "page_size" | "search",
    value: string,
  ) => {
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
      await createMutation.mutateAsync(payload).catch(() => {
        // onError handles all error cases (409 → deleted dialog, others → toast)
      });
    },
    createLoading: createMutation.isPending,
    deletedClientInfo,
    deletedClientDialogOpen: deletedClientInfo !== null,
    handleRestoreClient,
    handleForceCreate,
    handleDismissDeletedDialog,
    restoreLoading: restoreMutation.isPending,
    forceCreateLoading: createMutation.isPending,
    isAdvisor,
    can,
  };
};
