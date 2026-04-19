import { useMemo, useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { PaginatedDataTable } from "@/components/ui/table/PaginatedDataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  BinderDrawer,
  buildBindersColumns,
  BindersFiltersBar,
  useBindersPage,
  useReceiveBinderDrawer,
} from "@/features/binders";
import { BindersPageDialogs } from "../components/BindersPageDialogs";
import { useBindersPageDialogs } from "../hooks/useBindersPageDialogs";

type DrawerMode = "detail" | "receive" | null;

export const Binders: React.FC = () => {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);

  const {
    actionLoadingId,
    binders,
    total,
    counters,
    error,
    filters,
    deepLinkBinderId,
    selectedBinder,
    handleFilterChange,
    handleReset,
    setPage,
    handleSelectBinder,
    handleCloseDrawer,
    loading,
    deleteBinder,
    isDeleting,
    markReady,
    markReadyBulk,
    isMarkingReadyBulk,
    revertReady,
    returnBinder,
    isReturning,
    handoverBinders,
    isHandingOver,
  } = useBindersPage();
  const dialogs = useBindersPageDialogs({
    markReadyBulk,
    returnBinder,
    deleteBinder,
    handoverBinders,
  });

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

  const columns = useMemo(
    () =>
      buildBindersColumns({
        actionLoadingId,
        onMarkReady: (id) => void markReady(id),
        onRevertReady: (id) => void revertReady(id),
        onReturn: dialogs.openReturnDialog,
        onOpenDetail: (id) => {
          handleSelectBinder({ id });
          setDrawerMode("detail");
        },
        onDelete: dialogs.openDeleteDialog,
      }),
    [actionLoadingId, dialogs.openDeleteDialog, dialogs.openReturnDialog, markReady, revertReady, handleSelectBinder],
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

      <BindersFiltersBar
        filters={filters}
        counters={counters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

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
        emptyMessage="אין קלסרים התואמים לסינון הנוכחי"
        emptyState={{
          title: "לא נמצאו קלסרים",
          message: "נסה לאפס את הסינון, או קלוט חומר חדש.",
          action: { label: "קליטת חומר", onClick: handleOpenReceive },
        }}
      />

      <BindersPageDialogs
        confirmReturnForId={dialogs.confirmReturnForId}
        confirmDeleteForId={dialogs.confirmDeleteForId}
        pickupPersonName={dialogs.pickupPersonName}
        setPickupPersonName={dialogs.setPickupPersonName}
        isReturning={isReturning}
        isDeleting={isDeleting}
        onConfirmReturn={() => void dialogs.confirmReturn()}
        onCancelReturn={dialogs.closeReturnDialog}
        onConfirmDelete={() => void dialogs.confirmDelete()}
        onCancelDelete={dialogs.closeDeleteDialog}
        getBinderNumberLabel={getBinderNumberLabel}
        bulkReadyOpen={dialogs.bulkReadyOpen}
        onCloseBulkReady={dialogs.closeBulkReadyDialog}
        onConfirmBulkReady={() => void dialogs.confirmBulkReady(selectedBinder)}
        bulkReadyYear={dialogs.bulkReadyYear}
        bulkReadyMonth={dialogs.bulkReadyMonth}
        setBulkReadyYear={dialogs.setBulkReadyYear}
        setBulkReadyMonth={dialogs.setBulkReadyMonth}
        isMarkingReadyBulk={isMarkingReadyBulk}
        selectedBinder={selectedBinder}
        handoverOpen={dialogs.handoverOpen}
        onCloseHandover={dialogs.closeHandoverDialog}
        onSubmitHandover={(payload) => void dialogs.submitHandover(selectedBinder, payload)}
        isHandingOver={isHandingOver}
      />

      <BinderDrawer
        open={drawerOpen}
        mode={effectiveMode}
        binder={selectedBinder}
        onClose={handleCloseDrawerAll}
        onMarkReady={selectedBinder ? () => void markReady(selectedBinder.id) : undefined}
        onRevertReady={selectedBinder ? () => void revertReady(selectedBinder.id) : undefined}
        onReturn={selectedBinder ? () => dialogs.openReturnDialog(selectedBinder.id) : undefined}
        onBulkReady={selectedBinder ? dialogs.openBulkReadyDialog : undefined}
        onOpenHandover={selectedBinder ? dialogs.openHandoverDialog : undefined}
        onDelete={selectedBinder ? () => dialogs.openDeleteDialog(selectedBinder.id) : undefined}
        actionLoading={selectedBinder ? actionLoadingId === selectedBinder.id : false}
        receiveForm={receive.form}
        clientQuery={receive.clientQuery}
        selectedClient={receive.selectedClient}
        businesses={receive.businesses}
        annualReports={receive.annualReports}
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
