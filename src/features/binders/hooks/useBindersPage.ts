import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bindersApi } from "../../../api/binders.api";
import { getErrorMessage, parsePositiveInt } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { QK } from "../../../lib/queryKeys";

export const useBindersPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage, setSearchParams } = useSearchParamFilters();

  const filters = {
    status: searchParams.get("status") ?? "",
    work_state: searchParams.get("work_state") ?? "",
    client_id: parsePositiveInt(searchParams.get("client_id"), 0) || undefined,
    query: searchParams.get("query") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    sort_by: searchParams.get("sort_by") ?? "received_at",
    sort_dir: searchParams.get("sort_dir") ?? "desc",
  };

  const deepLinkBinderId = parsePositiveInt(searchParams.get("binder_id"), 0) || undefined;

  const listParams = {
    status: filters.status || undefined,
    client_id: filters.client_id || undefined,
    work_state: filters.work_state || undefined,
    query: filters.query || undefined,
    page: filters.page,
    page_size: filters.page_size,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
  };

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

  const handleFilterChange = (name: string, value: string) => {
    setFilter(name, value);
  };

  const handleSort = (sortBy: string) => {
    const currentDir = filters.sort_by === sortBy ? filters.sort_dir : "desc";
    const nextDir = currentDir === "desc" ? "asc" : "desc";
    const next = new URLSearchParams(searchParams);
    next.set("sort_by", sortBy);
    next.set("sort_dir", nextDir);
    next.set("page", "1");
    setSearchParams(next);
  };

  const handleSelectBinder = (binder: { id: number }) => {
    const next = new URLSearchParams(searchParams);
    next.set("binder_id", String(binder.id));
    setSearchParams(next, { replace: true });
  };

  const handleCloseDrawer = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("binder_id");
    setSearchParams(next, { replace: true });
  };

  return {
    activeActionKey,
    activeActionKeyRef,
    deepLinkBinderId,
    binders: bindersQuery.data?.items ?? [],
    total: bindersQuery.data?.total ?? 0,
    error: bindersQuery.error
      ? getErrorMessage(bindersQuery.error, "שגיאה בטעינת רשימת קלסרים")
      : null,
    filters,
    onAction,
    handleFilterChange,
    handleSort,
    setPage,
    handleSelectBinder,
    handleCloseDrawer,
    loading: bindersQuery.isPending,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
  };
};
