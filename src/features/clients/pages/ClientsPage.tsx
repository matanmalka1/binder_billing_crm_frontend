import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { ToolbarContainer } from "@/components/ui/layout/ToolbarContainer";
import { Alert } from "@/components/ui/overlays/Alert";
import { Button } from "@/components/ui/primitives/Button";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { DetailDrawer } from "@/components/ui/overlays/DetailDrawer";
import { ModalFormActions } from "@/components/ui/overlays/ModalFormActions";
import { PaginatedDataTable } from "@/components/ui/table/PaginatedDataTable";
import {
  buildClientColumns,
  ClientEditForm,
  ClientsFiltersBar,
  CreateClientModal,
  DeletedClientDialog,
  useClientsPage,
} from "@/features/clients";
import type { ClientResponse } from "@/features/clients/api";
import { ImportExportModal } from "@/features/importExport";

const EDIT_FORM_ID = "client-edit-form-list";

export const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientResponse | null>(null);
  const {
    activeActionKey,
    clients,
    error,
    filters,
    handleFilterChange,
    isAdvisor,
    loading,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
    setPage,
    total,
    createClient,
    createLoading,
    deletedClientInfo,
    deletedClientDialogOpen,
    handleRestoreClient,
    handleDismissDeletedDialog,
    restoreLoading,
    updateClient,
    updateLoading,
    can,
  } = useClientsPage();

  const columns = buildClientColumns({
    onEditClient: can.editClients ? (client) => setEditingClient(client) : undefined,
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="לקוחות"
        description="רשימת כל הלקוחות במערכת"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImportExport(true)}>
              ייבוא / ייצוא
            </Button>
            {can.createClients && (
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                לקוח חדש
              </Button>
            )}
          </div>
        }
      />
      {!can.editClients && (
        <Alert
          variant="info"
          message="צפייה בלבד. יצירה ועריכה של לקוחות זמינה ליועצים בלבד."
        />
      )}
      <ToolbarContainer>
        <ClientsFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </ToolbarContainer>
      <PaginatedDataTable
        data={clients}
        columns={columns}
        getRowKey={(client) => client.id}
        onRowClick={(client) => navigate(`/clients/${client.id}`)}
        isLoading={loading}
        error={error}
        summary={
          !loading && total > 0 ? (
            <p className="text-sm text-gray-500">סה&quot;כ {total} לקוחות</p>
          ) : undefined
        }
        page={filters.page}
        pageSize={filters.page_size}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => handleFilterChange("page_size", String(size))}
        emptyState={{
          title: "אין לקוחות להצגה",
          message: can.createClients
            ? "עדיין לא נוספו לקוחות. הוסף את הלקוח הראשון כדי להתחיל."
            : "לא נמצאו לקוחות התואמים את הסינון הנוכחי.",
          action: can.createClients
            ? { label: "לקוח חדש", onClick: () => setShowCreateModal(true) }
            : undefined,
        }}
      />
      <CreateClientModal
        open={showCreateModal && !deletedClientDialogOpen}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createClient}
        isLoading={createLoading}
      />
      <ImportExportModal open={showImportExport} onClose={() => setShowImportExport(false)} />
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.confirm?.title ?? "אישור פעולה"}
        message={pendingAction?.confirm?.message ?? "האם להמשיך?"}
        confirmLabel={pendingAction?.confirm?.confirmLabel ?? "אישור"}
        cancelLabel={pendingAction?.confirm?.cancelLabel ?? "ביטול"}
        isLoading={activeActionKey === pendingAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
      <DeletedClientDialog
        open={deletedClientDialogOpen}
        deletedClient={deletedClientInfo}
        isAdvisor={isAdvisor}
        onRestore={handleRestoreClient}
        onForceCreate={handleDismissDeletedDialog}
        onDismiss={() => {
          handleDismissDeletedDialog();
          setShowCreateModal(true);
        }}
        restoreLoading={restoreLoading}
        forceCreateLoading={false}
      />
      {editingClient && (
        <DetailDrawer
          open
          onClose={() => setEditingClient(null)}
          title="עריכת לקוח"
          footer={
            <ModalFormActions
              onCancel={() => setEditingClient(null)}
              cancelDisabled={updateLoading}
              submitLabel="שמור שינויים"
              submitType="submit"
              submitForm={EDIT_FORM_ID}
              submitLoading={updateLoading}
              submitDisabled={updateLoading}
            />
          }
        >
          <ClientEditForm
            client={editingClient}
            formId={EDIT_FORM_ID}
            onSave={async (payload) => {
              await updateClient(editingClient.id, payload);
              setEditingClient(null);
            }}
            onCancel={() => setEditingClient(null)}
            isLoading={updateLoading}
            hideFooter
          />
        </DetailDrawer>
      )}
    </div>
  );
};
