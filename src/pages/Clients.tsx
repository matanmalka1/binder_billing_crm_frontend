import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { api } from "../api/client";
import { getRequestErrorMessage, handleCanonicalActionError } from "../utils/errorHandler";
import { useUIStore } from "../store/ui.store";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { executeBackendAction } from "../features/actions/executeAction";
import type { ResolvedBackendAction } from "../features/actions/types";
import { ClientsFiltersBar } from "../features/clients/components/ClientsFiltersBar";
import { ClientsTableCard } from "../features/clients/components/ClientsTableCard";
import type { Client, ClientsListResponse } from "../features/clients/types";

export const Clients: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useUIStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ResolvedBackendAction | null>(null);

  const filters = { has_signals: searchParams.get("has_signals") ?? "" };

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (filters.has_signals) params.has_signals = filters.has_signals;
      const response = await api.get<ClientsListResponse>("/clients", { params });
      setClients(response.data.items ?? []);
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "שגיאה בטעינת רשימת לקוחות"));
    } finally {
      setLoading(false);
    }
  }, [filters.has_signals]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleFilterChange = (name: "has_signals", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next);
  };

  const runAction = useCallback(async (action: ResolvedBackendAction) => {
    setActiveActionKey(action.uiKey);
    try {
      await executeBackendAction(action);
      showToast("הפעולה הושלמה בהצלחה", "success");
      await fetchClients();
    } catch (requestError: unknown) {
      const message = handleCanonicalActionError({
        error: requestError,
        fallbackMessage: "שגיאה בביצוע פעולת לקוח",
        showToast,
      });
      setError(message);
    } finally {
      setActiveActionKey(null);
    }
  }, [fetchClients, showToast]);

  const handleActionClick = (action: ResolvedBackendAction) => {
    if (action.confirm) {
      setPendingAction(action);
      return;
    }
    void runAction(action);
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
      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
      {error && <Card className="bg-red-50 border-red-200"><p className="text-red-600">{error}</p></Card>}
      {!loading && !error && clients.length === 0 && <Card><p className="text-gray-600 text-center">אין לקוחות להצגה</p></Card>}
      {!loading && !error && clients.length > 0 && (
        <ClientsTableCard
          clients={clients}
          activeActionKey={activeActionKey}
          onActionClick={handleActionClick}
        />
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
