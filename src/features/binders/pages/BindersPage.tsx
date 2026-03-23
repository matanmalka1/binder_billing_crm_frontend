import { useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable } from "@/components/ui/DataTable";
import { PaginationCard } from "@/components/ui/PaginationCard";
import { ToolbarContainer } from "@/components/ui/ToolbarContainer";
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
    isMarkingReady,
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
    [actionLoadingId, markReady, handleSelectBinder, handleSort, filters.sort_by, filters.sort_dir],
  );

  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));
  const drawerOpen = drawerMode !== null || deepLinkBinderId !== undefined;
  const effectiveMode: "detail" | "receive" = drawerMode === "receive" ? "receive" : "detail";

  return (
    <div className="space-y-6">
      <PageHeader
        title="קלסרים"
        description="רשימת כל הקלסרים במערכת — סינון לפי סטטוס ומצב עבודה"
        actions={
          <Button variant="primary" size="sm" onClick={handleOpenReceive}>
            קליטת חומר
          </Button>
        }
      />

      <ToolbarContainer>
        <BindersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </ToolbarContainer>

      {error && <Alert variant="error" message={error} />}

      <DataTable
        data={binders}
        columns={columns}
        getRowKey={(binder) => binder.id}
        isLoading={loading}
        onRowClick={handleRowClick}
        emptyMessage="אין קלסרים התואמים לסינון הנוכחי"
        emptyState={{
          title: "לא נמצאו קלסרים",
          message: "נסה לאפס את הסינון, או קלוט חומר חדש.",
          action: { label: "קליטת חומר", onClick: handleOpenReceive },
        }}
      />

      {!loading && total > 0 && (
        <PaginationCard
          page={filters.page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
          showPageSizeSelect
          pageSize={filters.page_size}
          pageSizeOptions={[20, 50, 100]}
          onPageSizeChange={(pageSize) => handleFilterChange("page_size", String(pageSize))}
        />
      )}

      <ConfirmDialog
        open={confirmReturnForId !== null}
        title="החזרת קלסר"
        message={
          confirmReturnForId !== null
            ? `האם להחזיר את קלסר #${confirmReturnForId}?`
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
          placeholder="שם האיש המאסף *"
          value={pickupPersonName}
          onChange={(e) => setPickupPersonName(e.target.value)}
        />
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmDeleteForId !== null}
        title="מחיקת קלסר"
        message={`האם למחוק את קלסר #${confirmDeleteForId}? פעולה זו אינה ניתנת לביטול.`}
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
        actionLoading={isMarkingReady}
        receiveForm={receive.form}
        clientQuery={receive.clientQuery}
        selectedClient={receive.selectedClient}
        clientBinders={receive.clientBinders}
        allBinders={receive.allBinders}
        vatType={receive.vatType}
        onClientSelect={receive.handleClientSelect}
        onClientQueryChange={receive.handleClientQueryChange}
        onBinderSelect={receive.handleBinderSelect}
        onReceiveSubmit={receive.handleSubmit}
        isSubmitting={receive.isSubmitting}
      />
    </div>
  );
};
