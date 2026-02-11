import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { api } from "../api/client";
import { getApiErrorMessage } from "../utils/apiError";
import { TimelineCard } from "../features/timeline/components/TimelineCard";
import type { TimelineEvent, TimelineResponse } from "../features/timeline/types";

export const ClientTimeline: React.FC = () => {
  const { clientId } = useParams();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "שגיאה בטעינת ציר זמן"));
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">ציר זמן לקוח</h2>
        <p className="text-gray-600">מזהה לקוח: {clientId ?? "—"}</p>
        <Link to="/clients" className="inline-block text-sm font-medium text-blue-600">
          חזרה לרשימת לקוחות
        </Link>
      </header>

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

      {!loading && !error && <TimelineCard events={events} />}
    </div>
  );
};
