import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientsApi, type ClientResponse, type ListClientsParams } from "../../../api/clients.api";
import { getRequestErrorMessage, handleCanonicalActionError } from "../../../utils/utils";
import { executeAction } from "../../../lib/actions/runtime";
import { useConfirmableAction } from "../../actions/hooks/useConfirmableAction";
import type { ActionCommand } from "../../../lib/actions/types";
import { clientsKeys } from "../queryKeys";
import { usePaginatedResource } from "../../../hooks/usePaginatedResource";

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const { data, total, error, loading, filters, setFilter, setPage } = usePaginatedResource<
    {
      has_signals: string;
      status: string;
      page: number;
      page_size: number;
    },
    ListClientsParams,
    ClientResponse
  >({
    parseFilters: (params, page, pageSize) => ({
      has_signals: params.get("has_signals") ?? "",
      status: params.get("status") ?? "",
      page,
      page_size: pageSize,
    }),
    buildParams: (parsed) => ({
      has_signals:
        parsed.has_signals === "true"
          ? true
          : parsed.has_signals === "false"
            ? false
            : undefined,
      status: parsed.status || undefined,
      page: parsed.page,
      page_size: parsed.page_size,
    }),
    queryKey: (params) => clientsKeys.list(params),
    queryFn: (params) => clientsApi.list(params),
  });
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const actionMutation = useMutation({
    mutationFn: (action: ActionCommand) => executeAction(action),
    onSuccess: async () => {
      toast.success("הפעולה הושלמה בהצלחה");
      await queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
    },
  });

  const handleFilterChange = (name: "has_signals" | "status" | "page_size", value: string) =>
    setFilter(name, value);

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

  const { cancelPendingAction, confirmPendingAction, pendingAction, requestConfirmation } =
    useConfirmableAction(runAction);

  const handleActionClick = useCallback(
    (action: ActionCommand) => {
      if (requestConfirmation(action, Boolean(action.confirm))) return;
      void runAction(action);
    },
    [requestConfirmation, runAction],
  );

  return {
    activeActionKey,
    clients: data,
    error: error ? getRequestErrorMessage(error, "שגיאה בטעינת רשימת לקוחות") : null,
    filters,
    handleActionClick,
    handleFilterChange,
    loading,
    pendingAction,
    setPage,
    total,
    runAction,
    cancelPendingAction,
    confirmPendingAction,
  };
};
