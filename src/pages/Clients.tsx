import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { clientsApi } from "../api/clients.api";
import { getRequestErrorMessage, handleCanonicalActionError } from "../utils/errorHandler";
import { useUIStore } from "../store/ui.store";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { executeBackendAction } from "../features/actions/executeAction";
import type { ResolvedBackendAction } from "../features/actions/types";
import { ClientsFiltersBar } from "../features/clients/components/ClientsFiltersBar";
import { ClientsTableCard } from "../features/clients/components/ClientsTableCard";
import type { Client } from "../features/clients/types";

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const Clients: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useUIStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ResolvedBackendAction | null>(null);
  const [total, setTotal] = useState(0);

  const filters = {
    has_signals: searchParams.get("has_signals") ?? "",
    status: searchParams.get("status") ?? "",
    page: parsePositiveInt(searchParams.get("page"), 1),
    page_size: parsePositiveInt(searchParams.get("page_size"), 20),
  };

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsApi.list({
        has_signals:
          filters.has_signals === "true"
            ? true
            : filters.has_signals === "false"
            ? false
            : undefined,
        status: filters.status || undefined,
        page: filters.page,
        page_size: filters.page_size,
      });

      setClients(response.items ?? []);
      setTotal(response.total ?? 0);
    } catch (requestError: unknown) {
      setError(getRequestErrorMessage(requestError, "שגיאה בטעינת רשימת לקוחות"));
    } finally {
      setLoading(false);
    }
  }, [filters.has_signals, filters.page, filters.page_size, filters.status]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleFilterChange = (
    name: "has_signals" | "status" | "page_size",
    value: string,
  ) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    next.set("page", "1");
    setSearchParams(next);
  };

  const setPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));

  const runAction = useCallback(
    async (action: ResolvedBackendAction) => {
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
    },
    [fetchClients, showToast],
  );

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
        <ClientsFiltersBar
          filters={{
            has_signals: filters.has_signals,
            status: filters.status,
            page_size: String(filters.page_size),
          }}
          onFilterChange={handleFilterChange}
        />
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
        <>
          <ClientsTableCard
            clients={clients}
            activeActionKey={activeActionKey}
            onActionClick={handleActionClick}
          />
          <Card>
            <div className="flex items-center justify-between gap-3 text-sm">
              <p className="text-gray-600">
                עמוד {filters.page} מתוך {totalPages} ({total} תוצאות)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
                  onClick={() => setPage(filters.page - 1)}
                  disabled={filters.page <= 1}
                >
                  הקודם
                </button>
                <button
                  type="button"
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 disabled:opacity-50"
                  onClick={() => setPage(filters.page + 1)}
                  disabled={filters.page >= totalPages}
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
