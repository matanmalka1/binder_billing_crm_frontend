import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { PaginationCard } from "../components/ui/PaginationCard";
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
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">ציר זמן לקוח</h2>
        <p className="text-gray-600">מזהה לקוח: {clientId ?? "—"}</p>
        <Link
          to="/clients"
          className="inline-block text-sm font-medium text-blue-600"
        >
          חזרה לרשימת לקוחות
        </Link>
      </header>

      <Card>
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
      </Card>

      {loading && <PageLoading />}

      {error && <ErrorCard message={error} />}

      {!loading && !error && (
        <>
          <TimelineCard
            events={events}
            activeActionKey={activeActionKey}
            onAction={handleAction}
          />
          <PaginationCard
            page={page}
            totalPages={totalPages}
            total={total}
            label="אירועים"
            onPageChange={setPage}
          />
        </>
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
