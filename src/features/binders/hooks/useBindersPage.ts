import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { bindersApi } from "../../../api/binders.api";
import { handleCanonicalActionError } from "../../../utils/errorHandler";
import { resolveQueryErrorMessage } from "../../../utils/queryError";
import { executeBackendAction } from "../../actions/executeAction";
import { useConfirmableAction } from "../../actions/hooks/useConfirmableAction";
import type { ResolvedBackendAction } from "../../actions/types";
import type { Binder, BindersListResponse } from "../types";
import { bindersKeys } from "../queryKeys";

export const useBindersPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const filters = useMemo(
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
    queryKey: bindersKeys.list(listParams),
    queryFn: () => bindersApi.list(listParams),
  });

  const actionMutation = useMutation({
    mutationFn: (action: ResolvedBackendAction) => executeBackendAction(action),
    onSuccess: async () => {
      toast.success("הפעולה הושלמה בהצלחה");
      await queryClient.invalidateQueries({ queryKey: bindersKeys.lists() });
    },
  });

  const handleFilterChange = (name: "work_state" | "sla_state", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
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
          fallbackMessage: "שגיאה בביצוע פעולת תיק",
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
    (action: ResolvedBackendAction) => {
      if (requestConfirmation(action, Boolean(action.confirm))) return;
      void runAction(action);
    },
    [requestConfirmation, runAction],
  );

  return {
    activeActionKey,
    binders: ((bindersQuery.data as BindersListResponse | undefined)?.items ?? []) as Binder[],
    error: bindersQuery.error
      ? resolveQueryErrorMessage(bindersQuery.error, "שגיאה בטעינת רשימת תיקים")
      : null,
    filters,
    handleActionClick,
    handleFilterChange,
    loading: bindersQuery.isPending,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
  };
};
