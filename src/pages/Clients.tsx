import { Users } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { PaginatedTableView } from "../components/ui/PaginatedTableView";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
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

  return (
    <div className="space-y-6">
      <PageHeader title="לקוחות" description="רשימת כל הלקוחות במערכת" />

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

      <PaginatedTableView
        data={clients}
        loading={loading}
        error={error}
        pagination={{
          page: filters.page,
          pageSize: filters.page_size,
          total,
          onPageChange: setPage,
        }}
        renderTable={(data) => (
          <ClientsTableCard
            clients={data}
            activeActionKey={activeActionKey}
            onActionClick={handleActionClick}
          />
        )}
        emptyState={{ icon: Users, message: "אין לקוחות להצגה" }}
      />

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
