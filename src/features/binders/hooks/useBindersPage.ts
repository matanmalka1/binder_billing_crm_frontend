import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "../../../utils/toast";
import { bindersApi } from "../../../api/binders.api";
import { getErrorMessage, showErrorToast } from "../../../utils/utils";
import { executeAction } from "../../../lib/actions/runtime";
import { useConfirmableAction } from "../../actions/hooks/useConfirmableAction";
import type { ActionCommand } from "../../../lib/actions/types";
import type { BindersFilters } from "../types";

export const useBindersPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo<BindersFilters>(
    () => ({
      work_state: searchParams.get("work_state") ?? "",
      sla_state: searchParams.get("sla_state") ?? "",
    }),
    [searchParams],
  );

  const listParams = useMemo(
    () => ({
      work_state: filters.work_state || undefined,
      sla_state: filters.sla_state || undefined,
    }),
    [filters.sla_state, filters.work_state],
  );

  const bindersQuery = useQuery({
    queryKey: ["binders", "list", listParams] as const,
    queryFn: () => bindersApi.list(listParams),
  });

  const actionMutation = useMutation({
    mutationFn: (action: ActionCommand) => executeAction(action),
    onSuccess: async () => {
      toast.success("הפעולה הושלמה בהצלחה");
      await queryClient.invalidateQueries({ queryKey: ["binders", "list"] });
    },
  });

  const handleFilterChange = (name: keyof BindersFilters, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next);
  };

  const runAction = useCallback(
    async (action: ActionCommand) => {
      try {
        await actionMutation.mutateAsync(action);
      } catch (requestError: unknown) {
        showErrorToast(requestError, "שגיאה בביצוע פעולת תיק", { canonicalAction: true });
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

  const activeActionKey =
    actionMutation.isPending && actionMutation.variables
      ? actionMutation.variables.uiKey ?? null
      : null;

  return {
    activeActionKey,
    binders: bindersQuery.data?.items ?? [],
    error: bindersQuery.error
      ? getErrorMessage(bindersQuery.error, "שגיאה בטעינת רשימת תיקים")
      : null,
    filters,
    onAction,
    handleFilterChange,
    loading: bindersQuery.isPending,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
  };
};
