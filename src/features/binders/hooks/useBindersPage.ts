import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bindersApi } from "../api";
import { getErrorMessage, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { QK } from "../../../lib/queryKeys";
import { toast } from "../../../utils/toast";
import { useBinderDetail } from "./useBinderDetail";

export const useBindersPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage, setSearchParams } = useSearchParamFilters();

  const filters = {
    status: searchParams.get("status") ?? "",
    work_state: searchParams.get("work_state") ?? "",
    client_id: parsePositiveInt(searchParams.get("client_id"), 0) || undefined,
    query: searchParams.get("query") ?? "",
    year: searchParams.get("year") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    sort_by: searchParams.get("sort_by") ?? "received_at",
    sort_dir: searchParams.get("sort_dir") ?? "desc",
  };

  const deepLinkBinderId = parsePositiveInt(searchParams.get("binder_id"), 0) || undefined;
  const deepLinkBinderIdOrNull = deepLinkBinderId ?? null;

  const listParams = {
    status: filters.status || undefined,
    client_id: filters.client_id || undefined,
    work_state: filters.work_state || undefined,
    query: filters.query || undefined,
    year: filters.year ? Number(filters.year) : undefined,
    page: filters.page,
    page_size: filters.page_size,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
  };

  const bindersQuery = useQuery({
    queryKey: QK.binders.list(listParams),
    queryFn: () => bindersApi.list(listParams),
  });

  const pageMatch = bindersQuery.data?.items.find((binder) => binder.id === deepLinkBinderId) ?? null;
  const needsFallbackDetail =
    deepLinkBinderIdOrNull !== null && !bindersQuery.isPending && pageMatch === null;
  const binderDetailQuery = useBinderDetail(needsFallbackDetail ? deepLinkBinderIdOrNull : null);
  const selectedBinder = pageMatch ?? binderDetailQuery.data ?? null;

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

  const deleteMutation = useMutation({
    mutationFn: (binderId: number) => bindersApi.delete(binderId),
    onSuccess: () => {
      toast.success("הקלסר נמחק בהצלחה");
      handleCloseDrawer();
      void queryClient.invalidateQueries({ queryKey: QK.binders.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת קלסר"),
  });

  const markReadyMutation = useMutation({
    mutationFn: (binderId: number) => bindersApi.ready(binderId),
    onSuccess: () => {
      toast.success("הקלסר סומן כמוכן לאיסוף");
      void queryClient.invalidateQueries({ queryKey: QK.binders.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בסימון קלסר כמוכן"),
  });

  const returnBinderMutation = useMutation({
    mutationFn: ({ binderId, pickupPersonName }: { binderId: number; pickupPersonName: string }) =>
      bindersApi.returnBinder(binderId, { pickup_person_name: pickupPersonName }),
    onSuccess: () => {
      toast.success("הקלסר הוחזר בהצלחה");
      void queryClient.invalidateQueries({ queryKey: QK.binders.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהחזרת קלסר"),
  });

  const actionLoadingId =
    markReadyMutation.isPending
      ? (markReadyMutation.variables as number | undefined) ?? null
      : returnBinderMutation.isPending
      ? (returnBinderMutation.variables as { binderId: number } | undefined)?.binderId ?? null
      : null;

  return {
    actionLoadingId,
    deepLinkBinderId,
    selectedBinder,
    binders: bindersQuery.data?.items ?? [],
    total: bindersQuery.data?.total ?? 0,
    error: bindersQuery.error
      ? getErrorMessage(bindersQuery.error, "שגיאה בטעינת רשימת קלסרים")
      : null,
    filters,
    handleFilterChange,
    handleSort,
    setPage,
    handleSelectBinder,
    handleCloseDrawer,
    loading: bindersQuery.isPending,
    deleteBinder: (binderId: number) => deleteMutation.mutateAsync(binderId),
    isDeleting: deleteMutation.isPending,
    markReady: (binderId: number) => markReadyMutation.mutateAsync(binderId),
    isMarkingReady: markReadyMutation.isPending,
    returnBinder: (binderId: number, pickupPersonName: string) =>
      returnBinderMutation.mutateAsync({ binderId, pickupPersonName }),
    isReturning: returnBinderMutation.isPending,
  };
};
