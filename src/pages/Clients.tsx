import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { api, type ClientAction, triggerClientAction } from "../api/client";
import { getApiErrorMessage } from "../utils/apiError";
import { ClientsFiltersBar } from "../features/clients/components/ClientsFiltersBar";
import { ClientsTableCard } from "../features/clients/components/ClientsTableCard";
import type { Client, ClientsListResponse } from "../features/clients/types";

export const Clients: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const filters = {
    has_signals: searchParams.get("has_signals") ?? "",
  };

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (filters.has_signals) {
        params.has_signals = filters.has_signals;
      }
      const response = await api.get<ClientsListResponse>("/clients", { params });
      setClients(response.data.items);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "שגיאה בטעינת רשימת לקוחות"));
    } finally {
      setLoading(false);
    }
  }, [filters.has_signals]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleFilterChange = (name: "has_signals", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(name, value);
    } else {
      next.delete(name);
    }
    setSearchParams(next);
  };

  const handleActionClick = async (clientId: number, action: ClientAction) => {
    const key = `${clientId}-${action}`;
    setActiveActionKey(key);

    try {
      await triggerClientAction(clientId, action);
      await fetchClients();
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "שגיאה בביצוע פעולת לקוח"));
    } finally {
      setActiveActionKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">לקוחות</h2>
        <p className="text-gray-600">רשימת כל הלקוחות במערכת</p>
      </header>

      <Card title="סינון">
        <ClientsFiltersBar filters={filters} onFilterChange={handleFilterChange} />
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

      {!loading && !error && clients.length === 0 && (
        <Card>
          <p className="text-gray-600 text-center">אין לקוחות להצגה</p>
        </Card>
      )}

      {!loading && !error && clients.length > 0 && (
        <ClientsTableCard
          clients={clients}
          activeActionKey={activeActionKey}
          onActionClick={handleActionClick}
        />
      )}
    </div>
  );
};
