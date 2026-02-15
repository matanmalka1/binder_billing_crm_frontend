import { useParams } from "react-router-dom";
import { Clock4 } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { PaginatedTableView } from "../components/ui/PaginatedTableView";
import { Select } from "../components/ui/Select";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { TimelineCard } from "../features/timeline/components/TimelineCard";
import { useClientTimelinePage } from "../features/timeline/hooks/useClientTimelinePage";

export const ClientTimeline: React.FC = () => {
  const { clientId } = useParams();
  const {
    activeActionKey,
    error,
    events,
    handleAction,
    loading,
    page,
    pageSize,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
    setPage,
    setPageSize,
    total,
  } = useClientTimelinePage(clientId);

  return (
    <div className="space-y-6">
      {/* Standardized Header with Breadcrumbs */}
      <PageHeader
        title="ציר זמן לקוח"
        description={`מזהה לקוח: ${clientId ?? "—"}`}
        breadcrumbs={[{ label: "לקוחות", to: "/clients" }]}
      />

      {/* Standardized Filter Bar */}
      <FilterBar title="סינון">
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-600">גודל עמוד:</label>
          <Select
            value={String(pageSize)}
            onChange={(event) => setPageSize(event.target.value)}
            className="w-auto min-w-[96px] py-1"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </Select>
        </div>
      </FilterBar>

      {/* Standardized Table View with Pagination */}
      <PaginatedTableView
        data={events}
        loading={loading}
        error={error}
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
        }}
        renderTable={(data) => (
          <TimelineCard
            events={data}
            activeActionKey={activeActionKey}
            onAction={handleAction}
          />
        )}
        emptyState={{ icon: Clock4, message: "אין אירועים להצגה" }}
      />

      {/* Confirm Dialog */}
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
