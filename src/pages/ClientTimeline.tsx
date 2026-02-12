import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { api } from "../api/client";
import { getRequestErrorMessage, handleCanonicalActionError } from "../utils/errorHandler";
import { useUIStore } from "../store/ui.store";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { executeBackendAction } from "../features/actions/executeAction";
import type { ResolvedBackendAction } from "../features/actions/types";
import { TimelineCard } from "../features/timeline/components/TimelineCard";
import type { TimelineEvent, TimelineResponse } from "../features/timeline/types";

export const ClientTimeline: React.FC = () => {
  const { clientId } = useParams();
  const { showToast } = useUIStore();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ResolvedBackendAction | null>(null);

  const loadTimeline = useCallback(async () => {
    if (!clientId) {
      setError("מזהה לקוח חסר");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<TimelineResponse>(`/clients/${clientId}/timeline`);
      setEvents(response.data.events ?? []);
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "שגיאה בטעינת ציר זמן"));
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  const runAction = useCallback(async (action: ResolvedBackendAction) => {
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
  }, [loadTimeline, showToast]);

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
        <Link to="/clients" className="inline-block text-sm font-medium text-blue-600">חזרה לרשימת לקוחות</Link>
      </header>
      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
      {error && <Card className="border-red-200 bg-red-50"><p className="text-red-600">{error}</p></Card>}
      {!loading && !error && <TimelineCard events={events} activeActionKey={activeActionKey} onAction={handleAction} />}
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
