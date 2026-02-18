import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { bindersApi } from "../../../api/binders.api";
import { getErrorMessage } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";
import type { BindersFilters } from "../types";
import { QK } from "../../../lib/queryKeys";

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
    queryKey: QK.binders.list(listParams),
    queryFn: () => bindersApi.list(listParams),
  });

  const {
    activeActionKey,
    activeActionKeyRef,
    cancelPendingAction,
    confirmPendingAction,
    handleAction: onAction,
    pendingAction,
  } = useActionRunner({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK.binders.all }),
    errorFallback: "שגיאה בביצוע פעולת קלסר",
    canonicalAction: true,
  });

  const handleFilterChange = (name: keyof BindersFilters, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next);
  };

  return {
    activeActionKey,
    activeActionKeyRef,
    binders: bindersQuery.data?.items ?? [],
    error: bindersQuery.error
      ? getErrorMessage(bindersQuery.error, "שגיאה בטעינת רשימת קלסרים")
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
