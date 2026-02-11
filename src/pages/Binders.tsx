import React, { useCallback, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { api, type BinderAction, triggerBinderAction } from "../api/client";
import { getApiErrorMessage } from "../utils/apiError";
import { BindersTableCard } from "../features/binders/components/BindersTableCard";
import type { Binder, BindersListResponse } from "../features/binders/types";

export const Binders: React.FC = () => {
  const [binders, setBinders] = useState<Binder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const fetchBinders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<BindersListResponse>("/binders");
      setBinders(response.data.items);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "שגיאה בטעינת רשימת תיקים"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBinders();
  }, [fetchBinders]);

  const handleActionClick = async (binderId: number, action: BinderAction) => {
    const key = `${binderId}-${action}`;
    setActiveActionKey(key);

    try {
      await triggerBinderAction(binderId, action);
      await fetchBinders();
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "שגיאה בביצוע פעולת תיק"));
    } finally {
      setActiveActionKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">תיקים</h2>
        <p className="text-gray-600">רשימת כל התיקים במערכת</p>
      </header>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {!loading && !error && binders.length === 0 && (
        <Card>
          <p className="text-gray-600 text-center">אין תיקים להצגה</p>
        </Card>
      )}

      {!loading && !error && binders.length > 0 && (
        <BindersTableCard
          binders={binders}
          activeActionKey={activeActionKey}
          onActionClick={handleActionClick}
        />
      )}
    </div>
  );
};
