import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { InlineToolbar } from "../components/ui/InlineToolbar";
import { PaginationCard } from "../components/ui/PaginationCard";
import { DataTable } from "../components/ui/DataTable";
import { AccessBanner } from "../components/ui/AccessBanner";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ClientsFiltersBar } from "../features/clients/components/ClientsFiltersBar";
import { CreateClientModal } from "../features/clients/components/CreateClientModal";
import { buildClientColumns } from "../features/clients/components/ClientColumns";
import { useClientsPage } from "../features/clients/hooks/useClientsPage";
import { ImportExportModal } from "../features/importExport/components/ImportExportModal";

export const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  const {
    activeActionKey,
    clients,
    error,
    filters,
    handleFilterChange,
    loading,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
    setPage,
    total,
    createClient,
    createLoading,
    can,
  } = useClientsPage();

  const activeCount = clients.filter((c) => c.status === "active").length;
  const frozenCount = clients.filter((c) => c.status === "frozen").length;

  const columns = useMemo(() => buildClientColumns(), []);

  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / filters.page_size));

  return (
    <div className="space-y-6">
      <PageHeader
        title="לקוחות"
        description="רשימת כל הלקוחות במערכת"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImportExport(true)}>
              ייבוא / ייצוא
            </Button>
            {can.createClients && (
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                לקוח חדש
              </Button>
            )}
          </div>
        }
      />

      {!can.editClients && (
        <AccessBanner
          variant="info"
          message="צפייה בלבד. יצירה ועריכה של לקוחות זמינה ליועצים בלבד."
        />
      )}

      <InlineToolbar>
        <ClientsFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </InlineToolbar>

      {error && <ErrorCard message={error} />}

      {!loading && total > 0 && (
        <p className="text-sm text-gray-500">
          סה&quot;כ {total} לקוחות · {activeCount} פעילים · {frozenCount} מוקפאים
        </p>
      )}

      <DataTable
        data={clients}
        columns={columns}
        getRowKey={(client) => client.id}
        onRowClick={(client) => navigate(`/clients/${client.id}`)}
        isLoading={loading}
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

      {!loading && clients.length > 0 && (
        <PaginationCard
          page={filters.page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
          showPageSizeSelect
          pageSize={filters.page_size}
          pageSizeOptions={[20, 50, 100]}
          onPageSizeChange={(size) => handleFilterChange("page_size", String(size))}
        />
      )}

      <CreateClientModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createClient}
        isLoading={createLoading}
      />

      <ImportExportModal
        open={showImportExport}
        onClose={() => setShowImportExport(false)}
      />

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
    </div>
  );
};