import { useMemo, useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { InlineToolbar } from "../components/ui/InlineToolbar";
import { DataTable } from "../components/ui/DataTable";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Button } from "../components/ui/Button";
import { PaginationCard } from "../components/ui/PaginationCard";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { BindersFiltersBar } from "../features/binders/components/BindersFiltersBar";
import { buildBindersColumns } from "../features/binders/components/bindersColumns";
import { BinderDrawer } from "../features/binders/components/BinderDrawer";
import { useBindersPage } from "../features/binders/hooks/useBindersPage";
import { useReceiveBinderDrawer } from "../features/binders/hooks/useReceiveBinderDrawer";

type DrawerMode = "detail" | "receive" | null;

export const Binders: React.FC = () => {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const {
    activeActionKey,
    activeActionKeyRef,
    binders,
    total,
    cancelPendingAction,
    confirmPendingAction,
    error,
    filters,
    deepLinkBinderId,
    onAction,
    handleFilterChange,
    handleSort,
    setPage,
    handleSelectBinder,
    handleCloseDrawer,
    loading,
    pendingAction,
    deleteBinder,
    isDeleting,
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

  const selectedBinder = useMemo(
    () => binders.find((b) => b.id === deepLinkBinderId) ?? null,
    [binders, deepLinkBinderId],
  );

  // When a binder is selected via row click, switch to detail mode
  const handleRowClick = (binder: { id: number }) => {
    handleSelectBinder(binder);
    setDrawerMode("detail");
  };

  const columns = useMemo(
    () =>
      buildBindersColumns({
        activeActionKeyRef,
        onAction,
        sortBy: filters.sort_by,
        sortDir: filters.sort_dir,
        onSort: handleSort,
      }),
    [activeActionKeyRef, onAction, filters.sort_by, filters.sort_dir, handleSort],
  );

  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));
  const drawerOpen = drawerMode !== null || deepLinkBinderId !== undefined;
  const effectiveMode: "detail" | "receive" =
    drawerMode === "receive" ? "receive" : "detail";

  return (
    <div className="space-y-6">
      <PageHeader
        title="קלסרים"
        description="רשימת כל הקלסרים במערכת — סינון לפי סטטוס ומצב עבודה"
        actions={
          <Button variant="secondary" onClick={handleOpenReceive}>
            קליטת חומר
          </Button>
        }
      />

      <InlineToolbar>
        <BindersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </InlineToolbar>

      {error && <ErrorCard message={error} />}

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
        open={Boolean(pendingAction)}
        title={pendingAction?.confirm?.title ?? "אישור פעולה"}
        message={pendingAction?.confirm?.message ?? "האם להמשיך בביצוע הפעולה?"}
        confirmLabel={pendingAction?.confirm?.confirmLabel ?? "אישור"}
        cancelLabel={pendingAction?.confirm?.cancelLabel ?? "ביטול"}
        isLoading={activeActionKey === pendingAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />

      <ConfirmDialog
        open={isConfirmingDelete}
        title="מחיקת קלסר"
        message={selectedBinder ? `האם למחוק את הקלסר ${selectedBinder.binder_number}? פעולה זו אינה ניתנת לביטול.` : "האם למחוק את הקלסר?"}
        confirmLabel="מחק קלסר"
        cancelLabel="ביטול"
        isLoading={isDeleting}
        onConfirm={async () => {
          if (selectedBinder) {
            await deleteBinder(selectedBinder.id);
          }
          setIsConfirmingDelete(false);
        }}
        onCancel={() => setIsConfirmingDelete(false)}
      />

      <BinderDrawer
        open={drawerOpen}
        mode={effectiveMode}
        binder={selectedBinder}
        onClose={handleCloseDrawerAll}
        onAction={onAction}
        activeActionKeyRef={activeActionKeyRef}
        receiveForm={receive.form}
        clientQuery={receive.clientQuery}
        selectedClient={receive.selectedClient}
        onClientSelect={receive.handleClientSelect}
        onClientQueryChange={receive.handleClientQueryChange}
        onReceiveSubmit={receive.handleSubmit}
        isSubmitting={receive.isSubmitting}
        onDelete={effectiveMode === "detail" ? () => setIsConfirmingDelete(true) : undefined}
        isDeleting={isDeleting}
      />
    </div>
  );
};
