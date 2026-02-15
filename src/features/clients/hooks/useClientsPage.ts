import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { clientsApi, type ClientResponse, type ListClientsParams } from "../../../api/clients.api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { parsePositiveInt } from "../../../utils/utils";
import { executeAction } from "../../../lib/actions/runtime";
import { useConfirmableAction } from "../../actions/hooks/useConfirmableAction";
import type { ActionCommand } from "../../../lib/actions/types";

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
      has_signals: filters.has_signals ? filters.has_signals === "true" : undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.page_size,
    }),
    [filters],
  );

  const listQuery = useQuery({
    queryKey: ["clients", "list", apiParams] as const,
    queryFn: () => clientsApi.list(apiParams),
  });
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const actionMutation = useMutation({
    mutationFn: (action: ActionCommand) => executeAction(action),
    onSuccess: async () => {
      toast.success("הפעולה הושלמה בהצלחה");
      await queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
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
        showErrorToast(requestError, "שגיאה בביצוע פעולת לקוח", { canonicalAction: true });
      } finally {
        setActiveActionKey(null);
      }
    },
    [actionMutation],
  );

  const {
    cancelPendingAction,
    confirmPendingAction,
    handleAction: onAction,
    pendingAction,
  } = useConfirmableAction(runAction, (action) => Boolean(action.confirm));

  return {
    activeActionKey,
    clients: listQuery.data?.items ?? [],
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת רשימת לקוחות") : null,
    filters,
    onAction,
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
