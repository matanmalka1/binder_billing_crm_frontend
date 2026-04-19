import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bindersApi, bindersQK } from "../api";
import { getErrorMessage, parsePositiveInt, showErrorToast } from "../../../utils/utils";
import { useSearchParamFilters } from "../../../hooks/useSearchParamFilters";
import { toast } from "../../../utils/toast";
import { useBinderDetail } from "./useBinderDetail";

export const useBindersPage = () => {
  const queryClient = useQueryClient();
  const { searchParams, setFilter, setPage, setSearchParams } = useSearchParamFilters();

  const filters = {
    status: searchParams.get("status") ?? "",
    client_id: parsePositiveInt(searchParams.get("client_id"), 0) || undefined,
    query: searchParams.get("query") ?? "",
    year: searchParams.get("year") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
    sort_by: searchParams.get("sort_by") ?? "period_start",
    sort_dir: searchParams.get("sort_dir") ?? "desc",
  };

  const deepLinkBinderId = parsePositiveInt(searchParams.get("binder_id"), 0) || undefined;
  const deepLinkBinderIdOrNull = deepLinkBinderId ?? null;

  const listParams = {
    status: filters.status || undefined,
    client_id: filters.client_id || undefined,
    query: filters.query || undefined,
    year: filters.year ? Number(filters.year) : undefined,
    page: filters.page,
    page_size: filters.page_size,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
  };

  const bindersQuery = useQuery({
    queryKey: bindersQK.list(listParams),
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

  const handleReset = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("status");
    next.delete("query");
    next.delete("year");
    next.set("page", "1");
    setSearchParams(next);
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
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת קלסר"),
  });

  const markReadyMutation = useMutation({
    mutationFn: (binderId: number) => bindersApi.ready(binderId),
    onSuccess: () => {
      toast.success("הקלסר סומן כמוכן לאיסוף");
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בסימון קלסר כמוכן"),
  });

  const markReadyBulkMutation = useMutation({
    mutationFn: ({
      clientId,
      untilPeriodYear,
      untilPeriodMonth,
    }: {
      clientId: number;
      untilPeriodYear: number;
      untilPeriodMonth: number;
    }) =>
      bindersApi.markReadyBulk({
        client_id: clientId,
        until_period_year: untilPeriodYear,
        until_period_month: untilPeriodMonth,
      }),
    onSuccess: (updatedBinders) => {
      toast.success(
        updatedBinders.length > 0
          ? `${updatedBinders.length} קלסרים סומנו כמוכנים לאיסוף`
          : "לא נמצאו קלסרים מתאימים לסימון",
      );
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בסימון קבוצתי כמוכן"),
  });

  const returnBinderMutation = useMutation({
    mutationFn: ({ binderId, pickupPersonName }: { binderId: number; pickupPersonName: string }) =>
      bindersApi.returnBinder(binderId, { pickup_person_name: pickupPersonName }),
    onSuccess: () => {
      toast.success("הקלסר הוחזר בהצלחה");
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בהחזרת קלסר"),
  });

  const revertReadyMutation = useMutation({
    mutationFn: (binderId: number) => bindersApi.revertReady(binderId),
    onSuccess: () => {
      toast.success("סטטוס מוכן לאיסוף בוטל");
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה בביטול סטטוס מוכן"),
  });

  const handoverMutation = useMutation({
    mutationFn: (payload: {
      clientId: number;
      binderIds: number[];
      receivedByName: string;
      handedOverAt: string;
      untilPeriodYear: number;
      untilPeriodMonth: number;
      notes?: string | null;
    }) =>
      bindersApi.handover({
        client_id: payload.clientId,
        binder_ids: payload.binderIds,
        received_by_name: payload.receivedByName,
        handed_over_at: payload.handedOverAt,
        until_period_year: payload.untilPeriodYear,
        until_period_month: payload.untilPeriodMonth,
        notes: payload.notes ?? null,
      }),
    onSuccess: (handover) => {
      toast.success(`בוצעה מסירה של ${handover.binder_ids.length} קלסרים`);
      void queryClient.invalidateQueries({ queryKey: bindersQK.all });
    },
    onError: (err) => showErrorToast(err, "שגיאה במסירת קלסרים"),
  });

  const actionLoadingId =
    markReadyMutation.isPending
      ? (markReadyMutation.variables as number | undefined) ?? null
      : revertReadyMutation.isPending
      ? (revertReadyMutation.variables as number | undefined) ?? null
      : returnBinderMutation.isPending
      ? (returnBinderMutation.variables as { binderId: number } | undefined)?.binderId ?? null
      : null;

  return {
    actionLoadingId,
    deepLinkBinderId,
    selectedBinder,
    binders: bindersQuery.data?.items ?? [],
    total: bindersQuery.data?.total ?? 0,
    counters: bindersQuery.data?.counters ?? {
      total: 0,
      in_office: 0,
      closed_in_office: 0,
      ready_for_pickup: 0,
      returned: 0,
    },
    error: bindersQuery.error
      ? getErrorMessage(bindersQuery.error, "שגיאה בטעינת רשימת קלסרים")
      : null,
    filters,
    handleFilterChange,
    handleReset,
    handleSort,
    setPage,
    handleSelectBinder,
    handleCloseDrawer,
    loading: bindersQuery.isPending,
    deleteBinder: (binderId: number) => deleteMutation.mutateAsync(binderId),
    isDeleting: deleteMutation.isPending,
    markReady: (binderId: number) => markReadyMutation.mutateAsync(binderId),
    isMarkingReady: markReadyMutation.isPending,
    markReadyBulk: (clientId: number, untilPeriodYear: number, untilPeriodMonth: number) =>
      markReadyBulkMutation.mutateAsync({ clientId, untilPeriodYear, untilPeriodMonth }),
    isMarkingReadyBulk: markReadyBulkMutation.isPending,
    revertReady: (binderId: number) => revertReadyMutation.mutateAsync(binderId),
    isRevertingReady: revertReadyMutation.isPending,
    returnBinder: (binderId: number, pickupPersonName: string) =>
      returnBinderMutation.mutateAsync({ binderId, pickupPersonName }),
    isReturning: returnBinderMutation.isPending,
    handoverBinders: (
      clientId: number,
      binderIds: number[],
      receivedByName: string,
      handedOverAt: string,
      untilPeriodYear: number,
      untilPeriodMonth: number,
      notes?: string | null,
    ) =>
      handoverMutation.mutateAsync({
        clientId,
        binderIds,
        receivedByName,
        handedOverAt,
        untilPeriodYear,
        untilPeriodMonth,
        notes,
      }),
    isHandingOver: handoverMutation.isPending,
  };
};
