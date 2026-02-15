import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { Pagination } from "../components/ui/Pagination";
import { DataTable } from "../components/ui/DataTable";
import { AccessBanner } from "../components/ui/AccessBanner";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { ClientsFiltersBar } from "../features/clients/components/ClientsFiltersBar";
import { CreateClientModal } from "../features/clients/components/CreateClientModal";
import { buildClientColumns } from "../features/clients/components/clientColumns";
import { useClientsPage } from "../features/clients/hooks/useClientsPage";
import { useAuthStore } from "../store/auth.store";
import { clientsApi, type CreateClientPayload } from "../api/clients.api";
import { toast } from "../utils/toast";
import { getRequestErrorMessage } from "../utils/utils";

export const Clients: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdvisor = user?.role === "advisor";
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: async (client) => {
      toast.success("לקוח נוצר בהצלחה");
      setShowCreateModal(false);
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      navigate(`/clients/${client.id}`);
    },
    onError: (err) =>
      toast.error(getRequestErrorMessage(err, "שגיאה ביצירת לקוח")),
  });

  const columns = useMemo(
    () => buildClientColumns({ activeActionKey, handleActionClick }),
    [activeActionKey, handleActionClick],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="לקוחות"
        description="רשימת כל הלקוחות במערכת"
        actions={
          isAdvisor ? (
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

      {!isAdvisor && (
        <AccessBanner
          variant="info"
          message="יצירה ועריכה של לקוחות זמינה ליועצים בלבד."
        />
      )}

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
          onRowClick={(client) => navigate(`/clients/${client.id}`)}
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

      {isAdvisor && (
        <CreateClientModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            await createMutation.mutateAsync(data);
          }}
          isLoading={createMutation.isPending}
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
