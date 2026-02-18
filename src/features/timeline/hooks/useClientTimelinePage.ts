import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { timelineApi } from "../../../api/timeline.api";
import { getErrorMessage, isPositiveInt, parsePositiveInt } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";

export const useClientTimelinePage = (clientId: string | undefined) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("page_size"), 50);
  const clientIdNumber = Number(clientId || 0);
  const hasValidClient = isPositiveInt(clientIdNumber);

  const timelineParams = useMemo(
    () => ({ page, page_size: pageSize }),
    [page, pageSize],
  );

  const timelineQuery = useQuery({
    enabled: hasValidClient,
    queryKey: ["timeline", "client", clientIdNumber, "events", timelineParams] as const,
    queryFn: () => timelineApi.getClientTimeline(clientIdNumber, timelineParams),
  });

  const {
    activeActionKey,
    activeActionKeyRef,
    cancelPendingAction,
    confirmPendingAction,
    handleAction,
    pendingAction,
  } = useActionRunner({
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["timeline", "client", clientIdNumber],
      }),
    errorFallback: "שגיאה בביצוע פעולה",
    canonicalAction: true,
  });

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };
  const setPageSize = (nextPageSize: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("page_size", nextPageSize);
    next.set("page", "1");
    setSearchParams(next);
  };

  return {
    activeActionKey,
    activeActionKeyRef,
    error:
      !hasValidClient
        ? "מזהה לקוח חסר"
        : timelineQuery.error
          ? getErrorMessage(timelineQuery.error, "שגיאה בטעינת ציר זמן")
          : null,
    events: timelineQuery.data?.events ?? [],
    handleAction,
    loading: timelineQuery.isPending,
    page,
    pageSize,
    pendingAction,
    runAction,
    setPage,
    setPageSize,
    total: timelineQuery.data?.total ?? 0,
    cancelPendingAction,
    confirmPendingAction,
  };
};
