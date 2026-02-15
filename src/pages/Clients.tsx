import { useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { Pagination } from "../components/ui/Pagination";
import { DataTable } from "../components/ui/DataTable";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { ClientsFiltersBar } from "../features/clients/components/ClientsFiltersBar";
import { buildClientColumns } from "../features/clients/components/clientColumns";
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

  const columns = useMemo(
    () =>
      buildClientColumns({
        activeActionKey,
        handleActionClick,
      }),
    [activeActionKey, handleActionClick],
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="לקוחות" 
        description="רשימת כל הלקוחות במערכת"
      />

      <FilterBar>
        <ClientsFiltersBar
          filters={{
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
          isLoading={loading}
          emptyMessage="אין לקוחות להצגה"
        />

        {!loading && clients.length > 0 && (
          <Pagination
            currentPage={filters.page}
            total={total}
            pageSize={filters.page_size}
            onPageChange={setPage}
            showPageSizeSelect
            pageSizeOptions={[20, 50, 100]}
            onPageSizeChange={(pageSize) =>
              handleFilterChange("page_size", String(pageSize))
            }
          />
        )}
      </div>

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
