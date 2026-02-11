import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { api, type BinderAction, triggerBinderAction } from "../api/client";
import { getApiErrorMessage } from "../utils/apiError";
import { BindersFiltersBar } from "../features/binders/components/BindersFiltersBar";
import { BindersTableCard } from "../features/binders/components/BindersTableCard";
import type { Binder, BindersListResponse } from "../features/binders/types";

export const Binders: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [binders, setBinders] = useState<Binder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const filters = {
    work_state: searchParams.get("work_state") ?? "",
    sla_state: searchParams.get("sla_state") ?? "",
  };

  const fetchBinders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (filters.work_state) {
        params.work_state = filters.work_state;
      }
      if (filters.sla_state) {
        params.sla_state = filters.sla_state;
      }
      const response = await api.get<BindersListResponse>("/binders", { params });
      setBinders(response.data.items);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "שגיאה בטעינת רשימת תיקים"));
    } finally {
      setLoading(false);
    }
  }, [filters.sla_state, filters.work_state]);

  useEffect(() => {
    fetchBinders();
  }, [fetchBinders]);

  const handleFilterChange = (name: "work_state" | "sla_state", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(name, value);
    } else {
      next.delete(name);
    }
    setSearchParams(next);
  };

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

      <Card title="סינון">
        <BindersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </Card>

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
