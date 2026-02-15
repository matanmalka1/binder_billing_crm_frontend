import React from "react";
import { Card } from "../components/ui/Card";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { PaginationCard } from "../components/ui/PaginationCard";
import { PendingActionDialog } from "../features/actions/components/PendingActionDialog";
import { ClientsFiltersBar } from "../features/clients/components/ClientsFiltersBar";
import { ClientsTableCard } from "../features/clients/components/ClientsTableCard";
import { useClientsPage } from "../features/clients/hooks/useClientsPage";

export const Clients: React.FC = () => {
  const {
    activeActionKey,
    clients,
    error,
    filters,
    handleActionClick,
    handleFilterChange,
    loading,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
    setPage,
    total,
  } = useClientsPage();
  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));

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

      {loading && <PageLoading />}

      {error && <ErrorCard message={error} />}

      {!loading && !error && clients.length === 0 && (
        <Card>
          <p className="text-center text-gray-600">אין לקוחות להצגה</p>
        </Card>
      )}

      {!loading && !error && clients.length > 0 && (
        <>
          <ClientsTableCard
            clients={clients}
            activeActionKey={activeActionKey}
            onActionClick={handleActionClick}
          />
          <PaginationCard
            page={filters.page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}

      <PendingActionDialog
        pendingAction={pendingAction}
        activeActionKey={activeActionKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </div>
  );
};
