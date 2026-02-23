import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { timelineApi } from "../../../api/timeline.api";
import { getErrorMessage, isPositiveInt, parsePositiveInt } from "../../../utils/utils";
import { useActionRunner } from "../../actions/hooks/useActionRunner";
import { QK } from "../../../lib/queryKeys";

export const useClientTimelinePage = (clientId: string | undefined) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("page_size"), 50);
  const clientIdNumber = Number(clientId || 0);
  const hasValidClient = isPositiveInt(clientIdNumber);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const timelineParams = useMemo(
    () => ({ page, page_size: pageSize }),
    [page, pageSize],
  );

  const timelineQuery = useQuery({
    enabled: hasValidClient,
    queryKey: QK.timeline.clientEvents(clientIdNumber, timelineParams),
    queryFn: () => timelineApi.getClientTimeline(clientIdNumber, timelineParams),
  });

  const events = timelineQuery.data?.events ?? [];

  const eventTypeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((event) => {
      counts[event.event_type] = (counts[event.event_type] || 0) + 1;
    });

    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
    }));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesType =
        typeFilters.length === 0 || typeFilters.includes(event.event_type);

      const matchesQuery =
        !query ||
        event.description?.toLowerCase().includes(query) ||
        (event.binder_id !== null && String(event.binder_id).includes(query)) ||
        (event.charge_id !== null && String(event.charge_id).includes(query));

      return matchesType && matchesQuery;
    });
  }, [events, searchTerm, typeFilters]);

  const totalAvailableActions = useMemo(
    () =>
      events.reduce((totalActions, event) => {
        const actionCount =
          (event.actions?.length || 0) + (event.available_actions?.length || 0);
        return totalActions + actionCount;
      }, 0),
    [events],
  );

  const filteredAvailableActions = useMemo(
    () =>
      filteredEvents.reduce((totalActions, event) => {
        const actionCount =
          (event.actions?.length || 0) + (event.available_actions?.length || 0);
        return totalActions + actionCount;
      }, 0),
    [filteredEvents],
  );

  const lastEventTimestamp = useMemo(() => {
    if (events.length === 0) return null;
    return events.reduce((latestStr, current) => {
      const currentTime = new Date(current.timestamp).getTime();
      const latestTime = new Date(latestStr).getTime();
      return currentTime > latestTime ? current.timestamp : latestStr;
    }, events[0].timestamp);
  }, [events]);

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
        queryKey: QK.timeline.clientRoot(clientIdNumber),
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

  const toggleTypeFilter = (type: string) => {
    setTypeFilters((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilters([]);
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
    events,
    filteredEvents,
    handleAction,
    loading: timelineQuery.isPending,
    refreshing: timelineQuery.isRefetching,
    page,
    pageSize,
    pendingAction,
    runAction: handleAction,
    setPage,
    setPageSize,
    total: timelineQuery.data?.total ?? 0,
    cancelPendingAction,
    confirmPendingAction,
    refresh: () => timelineQuery.refetch(),
    filters: {
      searchTerm,
      setSearchTerm,
      typeFilters,
      toggleTypeFilter,
      clearFilters,
    },
    eventTypeStats,
    summary: {
      filteredTotal: filteredEvents.length,
      totalOnPage: events.length,
      totalAvailableActions,
      filteredAvailableActions,
      lastEventTimestamp,
    },
  };
};
