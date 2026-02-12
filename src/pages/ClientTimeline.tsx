import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { timelineApi } from "../api/timeline.api";
import { getRequestErrorMessage, handleCanonicalActionError } from "../utils/errorHandler";
import { useUIStore } from "../store/ui.store";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { executeBackendAction } from "../features/actions/executeAction";
import type { ResolvedBackendAction } from "../features/actions/types";
import { TimelineCard } from "../features/timeline/components/TimelineCard";
import type { TimelineEvent } from "../features/timeline/types";

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const ClientTimeline: React.FC = () => {
  const { clientId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useUIStore();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ResolvedBackendAction | null>(null);

  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = parsePositiveInt(searchParams.get("page_size"), 50);

  const loadTimeline = useCallback(async () => {
    if (!clientId) {
      setError("מזהה לקוח חסר");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await timelineApi.getClientTimeline(Number(clientId), {
        page,
        page_size: pageSize,
      });
      setEvents(response.events ?? []);
      setTotal(response.total ?? 0);
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "שגיאה בטעינת ציר זמן"));
    } finally {
      setLoading(false);
    }
  }, [clientId, page, pageSize]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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

  const runAction = useCallback(
    async (action: ResolvedBackendAction) => {
      setActiveActionKey(action.uiKey);
      try {
        await executeBackendAction(action);
        showToast("הפעולה בוצעה בהצלחה", "success");
        await loadTimeline();
      } catch (requestError: unknown) {
        const message = handleCanonicalActionError({
          error: requestError,
          fallbackMessage: "שגיאה בביצוע פעולה",
          showToast,
        });
        setError(message);
      } finally {
        setActiveActionKey(null);
      }
    },
    [loadTimeline, showToast],
  );

  const handleAction = (action: ResolvedBackendAction) => {
    if (action.confirm) {
      setPendingAction(action);
      return;
    }
    void runAction(action);
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">ציר זמן לקוח</h2>
        <p className="text-gray-600">מזהה לקוח: {clientId ?? "—"}</p>
        <Link to="/clients" className="inline-block text-sm font-medium text-blue-600">
          חזרה לרשימת לקוחות
        </Link>
      </header>

      <Card>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-gray-600">גודל עמוד:</label>
          <select
            value={String(pageSize)}
            onChange={(event) => setPageSize(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
      </Card>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {!loading && !error && (
        <>
          <TimelineCard
            events={events}
            activeActionKey={activeActionKey}
            onAction={handleAction}
          />
          <Card>
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="text-gray-600">
                עמוד {page} מתוך {totalPages} ({total} אירועים)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  הקודם
                </button>
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  הבא
                </button>
              </div>
            </div>
          </Card>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.confirm?.title || "אישור פעולה"}
        message={pendingAction?.confirm?.message || "האם להמשיך בביצוע הפעולה?"}
        confirmLabel={pendingAction?.confirm?.confirmLabel || "אישור"}
        cancelLabel={pendingAction?.confirm?.cancelLabel || "ביטול"}
        isLoading={activeActionKey === pendingAction?.uiKey}
        onConfirm={async () => {
          if (!pendingAction) return;
          await runAction(pendingAction);
          setPendingAction(null);
        }}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
};
