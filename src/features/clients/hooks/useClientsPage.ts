import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { clientsApi } from "../../../api/clients.api";
import { handleCanonicalActionError } from "../../../utils/errorHandler";
import { parsePositiveInt } from "../../../utils/number";
import { resolveQueryErrorMessage } from "../../../utils/queryError";
import { executeBackendAction } from "../../actions/executeAction";
import { useConfirmableAction } from "../../actions/hooks/useConfirmableAction";
import type { ResolvedBackendAction } from "../../actions/types";
import type { Client } from "../types";
import { clientsKeys } from "../queryKeys";

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const filters = useMemo(
    () => ({
      has_signals: searchParams.get("has_signals") ?? "",
      status: searchParams.get("status") ?? "",
      page: parsePositiveInt(searchParams.get("page"), 1),
      page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    }),
    [searchParams],
  );

  const listParams = useMemo(
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
    [filters.has_signals, filters.page, filters.page_size, filters.status],
  );

  const clientsQuery = useQuery({
    queryKey: clientsKeys.list(listParams),
    queryFn: () => clientsApi.list(listParams),
  });

  const actionMutation = useMutation({
    mutationFn: (action: ResolvedBackendAction) => executeBackendAction(action),
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
    async (action: ResolvedBackendAction) => {
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

  const { cancelPendingAction, confirmPendingAction, pendingAction, requestConfirmation } =
    useConfirmableAction(runAction);

  const handleActionClick = (action: ResolvedBackendAction) => {
    if (requestConfirmation(action, Boolean(action.confirm))) return;
    void runAction(action);
  };

  return {
    activeActionKey,
    clients: (clientsQuery.data?.items ?? []) as Client[],
    error: clientsQuery.error
      ? resolveQueryErrorMessage(clientsQuery.error, "שגיאה בטעינת רשימת לקוחות")
      : null,
    filters,
    handleActionClick,
    handleFilterChange,
    loading: clientsQuery.isPending,
    pendingAction,
    setPage,
    total: clientsQuery.data?.total ?? 0,
    runAction,
    cancelPendingAction,
    confirmPendingAction,
  };
};
