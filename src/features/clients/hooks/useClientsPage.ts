import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import {
  clientsApi,
  clientsQK,
  type CreateClientPayload,
  type UpdateClientPayload,
  type ListClientsParams,
} from "../api";
import { parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { useActionRunner } from "@/features/actions";
import { useRole } from "../../../hooks/useRole";
import { toast } from "../../../utils/toast";
import { isAxiosError } from "axios";

/** Extract the application-level error code from an Axios error response. */
const extractErrorCode = (err: unknown): string | null => {
  if (isAxiosError(err)) {
    return err.response?.data?.error ?? err.response?.data?.code ?? null;
  }
  return null;
};

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage } = useSearchParamFilters();
  const { isAdvisor, can } = useRole();

  // Pending payload held while the "deleted client" dialog is open.
  const [deletedClientInfo, setDeletedClientInfo] =
    useState<{ id: number; full_name: string; id_number: string; deleted_at: string } | null>(null);

  const filters = {
    search: searchParams.get("search") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: ListClientsParams = {
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
    queryKey: clientsQK.list(apiParams),
    queryFn: () => clientsApi.list(apiParams),
    errorMessage: "שגיאה בטעינת רשימת לקוחות",
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      toast.success("לקוח נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: clientsQK.all });
      setDeletedClientInfo(null);
    },
    onError: async (err, payload) => {
      const code = extractErrorCode(err);
      if (code === "CLIENT.DELETED_EXISTS") {
        try {
          const deleted = await clientsApi.getConflictByIdNumber(
            payload.id_number,
          );
          setDeletedClientInfo(deleted.deleted_clients[0] ?? null);
        } catch {
          showErrorToast(err, "שגיאה ביצירת לקוח");
        }
      } else {
        showErrorToast(err, "שגיאה ביצירת לקוח");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ clientId, payload }: { clientId: number; payload: UpdateClientPayload }) =>
      clientsApi.update(clientId, payload),
    onSuccess: () => {
      toast.success("הלקוח עודכן בהצלחה");
      queryClient.invalidateQueries({ queryKey: clientsQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בעדכון לקוח"),
  });

  const restoreMutation = useMutation({
    mutationFn: (clientId: number) => clientsApi.restore(clientId),
    onSuccess: () => {
      toast.success("הלקוח שוחזר בהצלחה");
      queryClient.invalidateQueries({ queryKey: clientsQK.all });
      setDeletedClientInfo(null);
    },
    onError: (err) => showErrorToast(err, "שגיאה בשחזור לקוח"),
  });

  const handleRestoreClient = useCallback(() => {
    if (!deletedClientInfo) return;
    restoreMutation.mutate(deletedClientInfo.id);
  }, [deletedClientInfo, restoreMutation]);

  const handleDismissDeletedDialog = useCallback(() => {
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
      queryClient.invalidateQueries({ queryKey: clientsQK.all }),
    errorFallback: "שגיאה בביצוע פעולת לקוח",
    canonicalAction: true,
  });

  const handleFilterChange = (
    name: "page_size" | "search",
    value: string,
  ) => {
    setFilter(name, value);
  };

  return {
    activeActionKey,
    activeActionKeyRef,
    clients: clientItems,
    error,
    filters,
    onAction,
    handleFilterChange,
    loading,
    pendingAction,
    setPage,
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
    handleDismissDeletedDialog,
    restoreLoading: restoreMutation.isPending,
    updateClient: async (clientId: number, payload: UpdateClientPayload): Promise<void> => {
      await updateMutation.mutateAsync({ clientId, payload });
    },
    updateLoading: updateMutation.isPending,
    isAdvisor,
    can,
  };
};
