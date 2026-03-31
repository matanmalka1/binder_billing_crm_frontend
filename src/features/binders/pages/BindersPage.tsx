import { useMemo, useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { PaginatedDataTable } from "@/components/ui/table/PaginatedDataTable";
import { ToolbarContainer } from "@/components/ui/layout/ToolbarContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  BinderDrawer,
  buildBindersColumns,
  BindersFiltersBar,
  useBindersPage,
  useReceiveBinderDrawer,
} from "@/features/binders";

type DrawerMode = "detail" | "receive" | null;

export const Binders: React.FC = () => {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [confirmDeleteForId, setConfirmDeleteForId] = useState<number | null>(null);
  const [confirmReturnForId, setConfirmReturnForId] = useState<number | null>(null);
  const [pickupPersonName, setPickupPersonName] = useState("");

  const {
    actionLoadingId,
    binders,
    total,
    error,
    filters,
    deepLinkBinderId,
    selectedBinder,
    handleFilterChange,
    handleSort,
    setPage,
    handleSelectBinder,
    handleCloseDrawer,
    loading,
    deleteBinder,
    isDeleting,
    markReady,
    revertReady,
    returnBinder,
    isReturning,
  } = useBindersPage();

  const handleOpenReceive = () => setDrawerMode("receive");
  const receive = useReceiveBinderDrawer(() => setDrawerMode(null));

  const handleCloseDrawerAll = () => {
    if (drawerMode === "receive") {
      receive.handleReset();
      setDrawerMode(null);
    } else {
      handleCloseDrawer();
      setDrawerMode(null);
    }
  };

  const handleRowClick = (binder: { id: number }) => {
    handleSelectBinder(binder);
    setDrawerMode("detail");
  };

  const handleReturnConfirm = async () => {
    if (confirmReturnForId === null) return;
    await returnBinder(confirmReturnForId, pickupPersonName);
    setConfirmReturnForId(null);
    setPickupPersonName("");
  };

  const columns = useMemo(
    () =>
      buildBindersColumns({
        actionLoadingId,
        onMarkReady: (id) => void markReady(id),
        onRevertReady: (id) => void revertReady(id),
        onReturn: (id) => setConfirmReturnForId(id),
        onOpenDetail: (id) => {
          handleSelectBinder({ id });
          setDrawerMode("detail");
        },
        onDelete: (id) => setConfirmDeleteForId(id),
        sortBy: filters.sort_by,
        sortDir: filters.sort_dir,
        onSort: handleSort,
      }),
    [actionLoadingId, markReady, revertReady, handleSelectBinder, handleSort, filters.sort_by, filters.sort_dir],
  );

  const getBinderNumberLabel = (binderId: number | null) => {
    if (binderId == null) return null;
    const fromList = binders.find((binder) => binder.id === binderId);
    if (fromList?.binder_number) return fromList.binder_number;
    if (selectedBinder?.id === binderId) return selectedBinder.binder_number;
    return `#${binderId}`;
  };

  const drawerOpen = drawerMode !== null || deepLinkBinderId !== undefined;
  const effectiveMode: "detail" | "receive" = drawerMode === "receive" ? "receive" : "detail";

  return (
    <div className="space-y-6">
      <PageHeader
        title="קלסרים"
        description="רשימת הקלסרים במשרד — סינון לפי סטטוס ותקופה"
        actions={
          <Button variant="primary" size="sm" onClick={handleOpenReceive}>
            קליטת חומר
          </Button>
        }
      />

      <ToolbarContainer>
        <BindersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </ToolbarContainer>

      <PaginatedDataTable
        data={binders}
        columns={columns}
        getRowKey={(binder) => binder.id}
        isLoading={loading}
        error={error}
        onRowClick={handleRowClick}
        page={filters.page}
        pageSize={filters.page_size}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(pageSize) => handleFilterChange("page_size", String(pageSize))}
        emptyMessage="אין קלסרים התואמים לסינון הנוכחי"
        emptyState={{
          title: "לא נמצאו קלסרים",
          message: "נסה לאפס את הסינון, או קלוט חומר חדש.",
          action: { label: "קליטת חומר", onClick: handleOpenReceive },
        }}
      />

      <ConfirmDialog
        open={confirmReturnForId !== null}
        title="החזרת קלסר"
        message={
          confirmReturnForId !== null
            ? `האם להחזיר את קלסר ${getBinderNumberLabel(confirmReturnForId)}?`
            : "האם להחזיר את הקלסר?"
        }
        confirmLabel="החזר קלסר"
        cancelLabel="ביטול"
        isLoading={isReturning}
        onConfirm={() => void handleReturnConfirm()}
        onCancel={() => {
          setConfirmReturnForId(null);
          setPickupPersonName("");
        }}
      >
        <input
          type="text"
          className="mt-3 w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="שם האיש המאסף (אופציונלי)"
          value={pickupPersonName}
          onChange={(e) => setPickupPersonName(e.target.value)}
        />
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmDeleteForId !== null}
        title="מחיקת קלסר"
        message={`האם למחוק את קלסר ${getBinderNumberLabel(confirmDeleteForId)}? פעולה זו אינה ניתנת לביטול.`}
        confirmLabel="מחק קלסר"
        cancelLabel="ביטול"
        isLoading={isDeleting}
        onConfirm={async () => {
          if (confirmDeleteForId !== null) {
            await deleteBinder(confirmDeleteForId);
          }
          setConfirmDeleteForId(null);
        }}
        onCancel={() => setConfirmDeleteForId(null)}
      />

      <BinderDrawer
        open={drawerOpen}
        mode={effectiveMode}
        binder={selectedBinder}
        onClose={handleCloseDrawerAll}
        onMarkReady={selectedBinder ? () => void markReady(selectedBinder.id) : undefined}
        onRevertReady={selectedBinder ? () => void revertReady(selectedBinder.id) : undefined}
        onReturn={selectedBinder ? () => setConfirmReturnForId(selectedBinder.id) : undefined}
        onDelete={selectedBinder ? () => setConfirmDeleteForId(selectedBinder.id) : undefined}
        actionLoading={selectedBinder ? actionLoadingId === selectedBinder.id : false}
        receiveForm={receive.form}
        clientQuery={receive.clientQuery}
        selectedClient={receive.selectedClient}
        businesses={receive.businesses}
        hasActiveBinder={receive.hasActiveBinder}
        vatType={receive.vatType}
        onClientSelect={receive.handleClientSelect}
        onClientQueryChange={receive.handleClientQueryChange}
        onReceiveSubmit={receive.handleSubmit}
        isSubmitting={receive.isSubmitting}
      />
    </div>
  );
};
