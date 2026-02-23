import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { bindersApi } from "../../../api/binders.api";
import { getErrorMessage, parsePositiveInt } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";
import type { BindersFilters } from "../types";
import { QK } from "../../../lib/queryKeys";

export const useBindersPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo<BindersFilters>(
    () => ({
      status: searchParams.get("status") ?? "",
      work_state: searchParams.get("work_state") ?? "",
      client_id: parsePositiveInt(searchParams.get("client_id"), 0) || undefined,
    }),
    [searchParams],
  );

  const deepLinkBinderId = parsePositiveInt(searchParams.get("binder_id"), 0) || undefined;

  const listParams = useMemo(
    () => ({
      status: filters.status || undefined,
      client_id: filters.client_id || undefined,
      work_state: filters.work_state || undefined,
    }),
    [filters.status, filters.work_state, filters.client_id],
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
    deepLinkBinderId,
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
