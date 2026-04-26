import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { useClientTimelinePage } from "../hooks/useClientTimelinePage";
import { TimelineCommandBar } from "./TimelineCommandBar";
import { groupEventsByDate, TimelineCard, type EventGroup } from "./TimelineCard";
import { UpcomingDeadlinesCard } from "./UpcomingDeadlinesCard";
import { PaginationCard } from "../../../components/ui/table/PaginationCard";
import { PageLoading } from "../../../components/ui/layout/PageLoading";
import { Alert } from "../../../components/ui/overlays/Alert";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";

interface ClientTimelineTabProps {
  clientId: string | undefined;
}

const isTodayGroup = (group: EventGroup): boolean => {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  return group.items.some((event) => event.displayTimestamp.slice(0, 10) === todayKey);
};

const isFutureDeadlineGroup = (group: EventGroup): boolean =>
  group.items.some((event) => event.filterKeys.includes("future"));

const getDefaultExpandedDates = (groups: EventGroup[]): Set<string> => {
  const defaults = new Set(
    groups
      .filter((group) => isTodayGroup(group) || isFutureDeadlineGroup(group))
      .map((group) => group.date),
  );
  if (defaults.size === 0 && groups[0]) defaults.add(groups[0].date);
  return defaults;
};

export const ClientTimelineTab: React.FC<ClientTimelineTabProps> = ({ clientId }) => {
  const {
    error,
    filteredEvents,
    loading,
    refreshing,
    page,
    pageSize,
    setPage,
    setPageSize,
    total,
    refresh,
    filters,
    eventTypeStats,
    summary,
    filteredUpcomingDeadlines,
    activeActionKey,
    handleAction,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
  } = useClientTimelinePage(clientId);

  const timelineGroups = useMemo(() => groupEventsByDate(filteredEvents), [filteredEvents]);
  const groupDates = useMemo(() => timelineGroups.map((group) => group.date), [timelineGroups]);
  const knownDateKeys = useRef<Set<string>>(new Set());
  const [expandedDateKeys, setExpandedDateKeys] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const visibleDates = new Set(groupDates);
    const defaultDates = getDefaultExpandedDates(timelineGroups);

    setExpandedDateKeys((current) => {
      const next = new Set<string>();
      for (const date of current) {
        if (visibleDates.has(date)) next.add(date);
      }
      for (const date of defaultDates) {
        if (!knownDateKeys.current.has(date)) next.add(date);
      }
      for (const date of visibleDates) knownDateKeys.current.add(date);
      return next;
    });
  }, [groupDates, timelineGroups]);

  if (loading) return <PageLoading message="טוען ציר זמן..." />;
  if (error)   return <Alert variant="error" message={error} />;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const toggleDate = (date: string) => {
    setExpandedDateKeys((current) => {
      const next = new Set(current);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };
  const expandAll = () => setExpandedDateKeys(new Set(groupDates));
  const collapseAll = () => setExpandedDateKeys(new Set());

  return (
    <div className="space-y-4">
      <TimelineCommandBar
        total={summary.totalOnPage}
        hasActiveFilters={filters.hasActiveFilters}
        lastEventTimestamp={summary.lastEventTimestamp}
        refreshing={refreshing}
        onRefresh={refresh}
        searchTerm={filters.searchTerm}
        onSearchChange={filters.setSearchTerm}
        typeFilters={filters.typeFilters}
        onToggleTypeFilter={filters.toggleTypeFilter}
        onClearFilters={filters.clearFilters}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        eventTypeStats={eventTypeStats}
      />

      <UpcomingDeadlinesCard deadlines={filteredUpcomingDeadlines} />

      <TimelineCard
        events={filteredEvents}
        expandedDateKeys={expandedDateKeys}
        onToggleDate={toggleDate}
        hasActiveFilters={filters.hasActiveFilters}
        onAction={handleAction}
        activeActionKey={activeActionKey}
      />

      {totalPages > 1 && (
        <PaginationCard
          page={page}
          totalPages={totalPages}
          total={total}
          label="אירועים"
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.confirm?.title || "אישור פעולה"}
        message={pendingAction?.confirm?.message || "האם להמשיך בביצוע הפעולה?"}
        confirmLabel={pendingAction?.confirm?.confirmLabel || "אישור"}
        cancelLabel={pendingAction?.confirm?.cancelLabel || "ביטול"}
        isLoading={activeActionKey === pendingAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </div>
  );
};

ClientTimelineTab.displayName = "ClientTimelineTab";
