import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { clientsApi, type ListClientsParams } from "../../../api/clients.api";
import { getErrorMessage, parsePositiveInt } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import type { CreateClientPayload } from "../../../api/clients.api";

export const useClientsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      has_signals: searchParams.get("has_signals") ?? "",
      status: searchParams.get("status") ?? "",
      search: searchParams.get("search") ?? "",
      page: parsePositiveInt(searchParams.get("page"), 1),
      page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    }),
    [searchParams],
  );

  const apiParams = useMemo<ListClientsParams>(
    () => ({
      has_signals: filters.has_signals ? filters.has_signals === "true" : undefined,
      status: filters.status || undefined,
      search: filters.search || undefined,
      page: filters.page,
      page_size: filters.page_size,
    }),
    [filters],
  );

  const listQuery = useQuery({
    queryKey: QK.clients.list(apiParams),
    queryFn: () => clientsApi.list(apiParams),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      toast.success("לקוח נוצר בהצלחה");
      queryClient.invalidateQueries({ queryKey: QK.clients.all });
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "שגיאה ביצירת לקוח")),
  });

  const {
    activeActionKey,
    activeActionKeyRef,
    cancelPendingAction,
    confirmPendingAction,
    handleAction: onAction,
    pendingAction,
  } = useActionRunner({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK.clients.all }),
    errorFallback: "שגיאה בביצוע פעולת לקוח",
    canonicalAction: true,
  });

  const handleFilterChange = (name: "has_signals" | "status" | "page_size" | "search", value: string) => {
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
    createClient: (payload: CreateClientPayload) => createMutation.mutateAsync(payload),
    createLoading: createMutation.isPending,
  };
};
