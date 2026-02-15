import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { clientsApi, type ClientResponse, type ListClientsParams } from "../../../api/clients.api";
import { getRequestErrorMessage, handleCanonicalActionError } from "../../../utils/utils";
import { parsePositiveInt } from "../../../utils/utils";
import { executeAction } from "../../../lib/actions/runtime";
import { useConfirmableAction } from "../../actions/hooks/useConfirmableAction";
import type { ActionCommand } from "../../../lib/actions/types";
import { clientsKeys } from "../queryKeys";

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      has_signals: searchParams.get("has_signals") ?? "",
      status: searchParams.get("status") ?? "",
      page: parsePositiveInt(searchParams.get("page"), 1),
      page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    }),
    [searchParams],
  );

  const apiParams = useMemo<ListClientsParams>(
    () => ({
      has_signals:
        filters.has_signals === "true"
          ? true
          : filters.has_signals === "false"
            ? false
            : undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.page_size,
    }),
    [filters],
  );

  const listQuery = useQuery({
    queryKey: clientsKeys.list(apiParams),
    queryFn: () => clientsApi.list(apiParams),
  });
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const actionMutation = useMutation({
    mutationFn: (action: ActionCommand) => executeAction(action),
    onSuccess: async () => {
      toast.success("הפעולה הושלמה בהצלחה");
      await queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
    },
  });

  const handleFilterChange = (name: "has_signals" | "status" | "page_size", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    next.set("page", "1");
    setSearchParams(next);
  };

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const runAction = useCallback(
    async (action: ActionCommand) => {
      setActiveActionKey(action.uiKey);
      try {
        await actionMutation.mutateAsync(action);
      } catch (requestError: unknown) {
        handleCanonicalActionError({
          error: requestError,
          fallbackMessage: "שגיאה בביצוע פעולת לקוח",
        });
      } finally {
        setActiveActionKey(null);
      }
    },
    [actionMutation],
  );

  const {
    cancelPendingAction,
    confirmPendingAction,
    handleAction: handleActionClick,
    pendingAction,
  } = useConfirmableAction(runAction, (action) => Boolean(action.confirm));

  return {
    activeActionKey,
    clients: listQuery.data?.items ?? ([] as ClientResponse[]),
    error: listQuery.error ? getRequestErrorMessage(listQuery.error, "שגיאה בטעינת רשימת לקוחות") : null,
    filters,
    handleActionClick,
    handleFilterChange,
    loading: listQuery.isPending,
    pendingAction,
    setPage,
    total: listQuery.data?.total ?? 0,
    runAction,
    cancelPendingAction,
    confirmPendingAction,
  };
};
