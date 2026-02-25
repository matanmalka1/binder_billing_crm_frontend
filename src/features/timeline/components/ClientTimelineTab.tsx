import { useClientTimelinePage } from "../hooks/useClientTimelinePage";
import { TimelineCommandBar } from "./TimelineCommandBar";
import { TimelineFilterPanel } from "./TimelineFilterPanel";
import { TimelineCard } from "./TimelineCard";
import { ConfirmDialog } from "../../actions/components/ConfirmDialog";
import { PaginationCard } from "../../../components/ui/PaginationCard";
import { PageLoading } from "../../../components/ui/PageLoading";
import { ErrorCard } from "../../../components/ui/ErrorCard";

interface ClientTimelineTabProps {
  clientId: string | undefined;
}

export const ClientTimelineTab: React.FC<ClientTimelineTabProps> = ({ clientId }) => {
  const {
    activeActionKey,
    error,
    filteredEvents,
    handleAction,
    loading,
    refreshing,
    page,
    pageSize,
    pendingAction,
    setPage,
    setPageSize,
    total,
    cancelPendingAction,
    confirmPendingAction,
    refresh,
    filters,
    eventTypeStats,
    summary,
  } = useClientTimelinePage(clientId);

  if (loading) return <PageLoading message="טוען ציר זמן..." />;
  if (error) return <ErrorCard message={error} />;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <TimelineCommandBar
        total={summary.totalOnPage}
        filteredCount={summary.filteredTotal}
        actionsCount={summary.filteredAvailableActions}
        hasActiveFilters={filters.hasActiveFilters}
        lastEventTimestamp={summary.lastEventTimestamp}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      <TimelineFilterPanel
        searchTerm={filters.searchTerm}
        onSearchChange={filters.setSearchTerm}
        typeFilters={filters.typeFilters}
        onToggleTypeFilter={filters.toggleTypeFilter}
        onClearFilters={filters.clearFilters}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        eventTypeStats={eventTypeStats}
        hasActiveFilters={filters.hasActiveFilters}
      />

      <TimelineCard
        events={filteredEvents}
        activeActionKey={activeActionKey}
        onAction={handleAction}
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
        title={pendingAction?.confirm?.title ?? "אישור פעולה"}
        message={pendingAction?.confirm?.message ?? "האם להמשיך בביצוע הפעולה?"}
        confirmLabel={pendingAction?.confirm?.confirmLabel ?? "אישור"}
        cancelLabel={pendingAction?.confirm?.cancelLabel ?? "ביטול"}
        isLoading={activeActionKey === pendingAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </div>
  );
};

ClientTimelineTab.displayName = "ClientTimelineTab";