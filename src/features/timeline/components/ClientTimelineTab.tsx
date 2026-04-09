import { useClientTimelinePage } from "../hooks/useClientTimelinePage";
import { TimelineCommandBar } from "./TimelineCommandBar";
import { TimelineCard } from "./TimelineCard";
import { PaginationCard } from "../../../components/ui/table/PaginationCard";
import { PageLoading } from "../../../components/ui/layout/PageLoading";
import { Alert } from "../../../components/ui/overlays/Alert";

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
  } = useClientTimelinePage(clientId);

  if (loading) return <PageLoading message="טוען ציר זמן..." />;
  if (error) return <Alert variant="error" message={error} />;

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

      <TimelineCard events={filteredEvents} />

      {totalPages > 1 && (
        <PaginationCard
          page={page}
          totalPages={totalPages}
          total={total}
          label="אירועים"
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

ClientTimelineTab.displayName = "ClientTimelineTab";
