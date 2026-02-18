import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { clientsApi, type ListClientsParams } from "../../../api/clients.api";
import { getErrorMessage, parsePositiveInt } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";

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

  const {
    activeActionKey,
    activeActionKeyRef,
    cancelPendingAction,
    confirmPendingAction,
    handleAction: onAction,
    pendingAction,
  } = useActionRunner({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients", "list"] }),
    errorFallback: "שגיאה בביצוע פעולת לקוח",
    canonicalAction: true,
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

  return {
    activeActionKey,
    activeActionKeyRef,
    clients: listQuery.data?.items ?? [],
    error: listQuery.error ? getErrorMessage(listQuery.error, "שגיאה בטעינת רשימת לקוחות") : null,
    filters,
    onAction,
    handleFilterChange,
    loading: listQuery.isPending,
    pendingAction,
    setPage,
    total: listQuery.data?.total ?? 0,
    cancelPendingAction,
    confirmPendingAction,
  };
};
