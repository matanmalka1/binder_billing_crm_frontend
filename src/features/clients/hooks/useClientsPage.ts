import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "../../../utils/utils";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import {
  clientsApi,
  clientsQK,
  type CreateClientPayload,
  type UpdateClientPayload,
  type ListClientsParams,
} from "../api";
import {
  DEFAULT_CLIENT_SORT_BY,
  DEFAULT_CLIENT_SORT_ORDER,
  type ClientSortBy,
  type ClientSortOrder,
} from "../constants";
import { parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { useActionRunner } from "@/features/actions";
import { useRole } from "../../../hooks/useRole";
import { toast } from "../../../utils/toast";
import { isAxiosError } from "axios";

/** Extract the application-level error code from an Axios error response. */
const extractErrorCode = (err: unknown): string | null => {
  if (isAxiosError(err)) {
    return (
      err.response?.data?.error ??
      err.response?.data?.code ??
      err.response?.data?.detail?.error ??
      null
    );
  }
  return null;
};

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage, resetFilters } = useSearchParamFilters();
  const { isAdvisor, can } = useRole();

  // Pending payload held while the "deleted client" dialog is open.
  const [deletedClientInfo, setDeletedClientInfo] =
    useState<{ id: number; full_name: string; id_number: string; deleted_at: string } | null>(null);

  const filters = {
    search: searchParams.get("search") ?? "",
    status: (searchParams.get("status") as ListClientsParams["status"]) ?? undefined,
    accountant_id: can.editClients
      ? parsePositiveInt(searchParams.get("accountant_id"), 0) || undefined
      : undefined,
    sort_by: (searchParams.get("sort_by") as ClientSortBy) || DEFAULT_CLIENT_SORT_BY,
    sort_order: (searchParams.get("sort_order") as ClientSortOrder) || DEFAULT_CLIENT_SORT_ORDER,
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const apiParams: ListClientsParams = {
    search: filters.search || undefined,
    status: filters.status,
    accountant_id: filters.accountant_id,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
    page: filters.page,
    page_size: filters.page_size,
  };

  const { data: listData, isPending: loading, error: listError } = useQuery({
    queryKey: clientsQK.list(apiParams),
    queryFn: () => clientsApi.list(apiParams),
  });

  const clientItems = listData?.items ?? [];
  const total = listData?.total ?? 0;
  const stats = listData?.stats ?? { active: 0, frozen: 0, closed: 0 };
  const error = listError ? getErrorMessage(listError, "שגיאה בטעינת רשימת לקוחות") : null;

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: (data) => {
      const summary = data.impact.items.map((i) => `${i.label}: ${i.count}`).join(" | ");
      toast.success(`לקוח נוצר בהצלחה\n${summary}`);
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
    name: "page_size" | "search" | "status" | "sort_by" | "sort_order",
    value: string,
  ) => {
    setFilter(name, value);
  };

  const handleReset = () => {
    resetFilters({
      sort_by: DEFAULT_CLIENT_SORT_BY,
      sort_order: DEFAULT_CLIENT_SORT_ORDER,
    });
  };

  return {
    activeActionKey,
    activeActionKeyRef,
    clients: clientItems,
    error,
    filters,
    onAction,
    handleFilterChange,
    handleReset,
    loading,
    pendingAction,
    setPage,
    stats,
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
