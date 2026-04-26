import { useClientTimelinePage } from "../hooks/useClientTimelinePage";
import { TimelineCommandBar } from "./TimelineCommandBar";
import { TimelineCard } from "./TimelineCard";
import { UpcomingDeadlinesCard } from "./UpcomingDeadlinesCard";
import { PaginationCard } from "../../../components/ui/table/PaginationCard";
import { PageLoading } from "../../../components/ui/layout/PageLoading";
import { Alert } from "../../../components/ui/overlays/Alert";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";

interface ClientTimelineTabProps {
  clientId: string | undefined;
}

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

  if (loading) return <PageLoading message="טוען ציר זמן..." />;
  if (error)   return <Alert variant="error" message={error} />;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        eventTypeStats={eventTypeStats}
      />

      <UpcomingDeadlinesCard deadlines={filteredUpcomingDeadlines} />

      <TimelineCard
        events={filteredEvents}
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
