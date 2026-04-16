import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { timelineApi, timelineQK } from "../api";
import { getErrorMessage, isPositiveInt, parsePositiveInt } from "../../../utils/utils";
import { useActionRunner } from "@/features/actions";
import type { TimelineEvent } from "../api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EventTypeStat {
  type:  string;
  count: number;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useClientTimelinePage = (clientId: string | undefined) => {
  const queryClient    = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page     = parsePositiveInt(searchParams.get("page"),      1);
  const pageSize = parsePositiveInt(searchParams.get("page_size"), 50);

  const clientIdNumber  = Number(clientId ?? 0);
  const hasValidClient  = isPositiveInt(clientIdNumber);

  const [searchTerm,   setSearchTerm]   = useState("");
  const [typeFilters,  setTypeFilters]  = useState<string[]>([]);

  // ── Query ──────────────────────────────────────────────────────────────────

  const timelineParams = useMemo(
    () => ({ page, page_size: pageSize }),
    [page, pageSize],
  );

  const timelineQuery = useQuery({
    enabled:   hasValidClient,
    queryKey:  timelineQK.clientEvents(clientIdNumber, timelineParams),
    queryFn:   () => timelineApi.getClientTimeline(clientIdNumber, timelineParams),
  });

  const events = useMemo<TimelineEvent[]>(
    () => timelineQuery.data?.events ?? [],
    [timelineQuery.data?.events],
  );

  // ── Derived stats ──────────────────────────────────────────────────────────

  const eventTypeStats = useMemo<EventTypeStat[]>(() => {
    const counts: Record<string, number> = {};
    for (const { event_type } of events) {
      counts[event_type] = (counts[event_type] ?? 0) + 1;
    }
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [events]);

  const lastEventTimestamp = useMemo<string | null>(() => {
    if (events.length === 0) return null;
    return events.reduce((latest, { timestamp }) =>
      new Date(timestamp) > new Date(latest) ? timestamp : latest,
      events[0].timestamp,
    );
  }, [events]);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const hasActiveFilters = typeFilters.length > 0 || searchTerm.trim().length > 0;

  const filteredEvents = useMemo<TimelineEvent[]>(() => {
    if (!hasActiveFilters) return events;

    const query = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const matchesType =
        typeFilters.length === 0 || typeFilters.includes(event.event_type);

      const matchesSearch =
        !query ||
        event.description?.toLowerCase().includes(query) ||
        (event.binder_id != null && String(event.binder_id).includes(query)) ||
        (event.charge_id  != null && String(event.charge_id).includes(query));

      return matchesType && matchesSearch;
    });
  }, [events, searchTerm, typeFilters, hasActiveFilters]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const {
    activeActionKey,
    activeActionKeyRef,
    cancelPendingAction,
    confirmPendingAction,
    handleAction,
    pendingAction,
  } = useActionRunner({
    onSuccess:     () => queryClient.invalidateQueries({ queryKey: timelineQK.clientRoot(clientIdNumber) }),
    errorFallback: "שגיאה בביצוע פעולה",
    canonicalAction: true,
  });

  // ── Navigation helpers ─────────────────────────────────────────────────────

  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(nextPage));
      return next;
    });
  };

  const setPageSize = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page_size", value);
      next.set("page", "1");
      return next;
    });
  };

  // ── Filter helpers ─────────────────────────────────────────────────────────

  const toggleTypeFilter = (type: string) =>
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilters([]);
  };

  // ── Error ──────────────────────────────────────────────────────────────────

  const error = !hasValidClient
    ? "מזהה לקוח חסר"
    : timelineQuery.error
      ? getErrorMessage(timelineQuery.error, "שגיאה בטעינת ציר זמן")
      : null;

  // ── Public API ─────────────────────────────────────────────────────────────

  return {
    loading:    timelineQuery.isPending,
    refreshing: timelineQuery.isRefetching,
    refresh:    () => timelineQuery.refetch(),
    error,

    page,
    pageSize,
    total: timelineQuery.data?.total ?? 0,
    setPage,
    setPageSize,

    events,
    filteredEvents,
    eventTypeStats,

    activeActionKey,
    activeActionKeyRef,
    handleAction,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,

    filters: {
      searchTerm,
      setSearchTerm,
      typeFilters,
      toggleTypeFilter,
      clearFilters,
      hasActiveFilters,
    },

    summary: {
      totalOnPage:        events.length,
      filteredTotal:      filteredEvents.length,
      lastEventTimestamp,
    },
  };
};