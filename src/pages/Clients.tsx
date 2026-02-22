import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { PaginationCard } from "../components/ui/PaginationCard";
import { DataTable } from "../components/ui/DataTable";
import { AccessBanner } from "../components/ui/AccessBanner";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { ClientsFiltersBar } from "../features/clients/components/ClientsFiltersBar";
import { CreateClientModal } from "../features/clients/components/CreateClientModal";
import { buildClientColumns } from "../features/clients/components/clientColumns";
import { useClientsPage } from "../features/clients/hooks/useClientsPage";
import { useRole } from "../hooks/useRole";

export const Clients: React.FC = () => {
  const navigate = useNavigate();
  const { isAdvisor, can } = useRole();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    activeActionKey,
    activeActionKeyRef,
    clients,
    error,
    filters,
    onAction,
    handleFilterChange,
    loading,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
    setPage,
    total,
    createClient,
    createLoading,
  } = useClientsPage();

  const columns = useMemo(
    () => buildClientColumns({ activeActionKeyRef, onAction }),
    [activeActionKeyRef, onAction],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(Math.max(total, 1) / filters.page_size),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="לקוחות"
        description="רשימת כל הלקוחות במערכת"
        actions={
          can.createClients ? (
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="gap-2"
            >
              לקוח חדש
            </Button>
          ) : null
        }
      />

      {!can.editClients && (
        <AccessBanner
          variant="info"
          message="יצירה ועריכה של לקוחות זמינה ליועצים בלבד."
        />
      )}

      <FilterBar>
        <ClientsFiltersBar
          filters={{
            search: filters.search,
            has_signals: filters.has_signals,
            status: filters.status,
            page: filters.page,
            page_size: filters.page_size,
          }}
          onFilterChange={handleFilterChange}
        />
      </FilterBar>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <DataTable
          data={clients}
          columns={columns}
          getRowKey={(client) => client.id}
          onRowClick={(client) => navigate(`/clients/${client.id}`)}
          isLoading={loading}
          emptyMessage="אין לקוחות להצגה"
        />

        {!loading && clients.length > 0 && (
          <PaginationCard
            page={filters.page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            showPageSizeSelect
            pageSize={filters.page_size}
            pageSizeOptions={[20, 50, 100]}
            onPageSizeChange={(pageSize) =>
              handleFilterChange("page_size", String(pageSize))
            }
          />
        )}
      </div>

      {isAdvisor && (
        <CreateClientModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            const client = await createClient(data);
            setShowCreateModal(false);
            navigate(`/clients/${client.id}`);
          }}
          isLoading={createLoading}
        />
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
