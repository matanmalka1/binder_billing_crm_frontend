import { useMemo } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { PaginatedDataTable } from "@/components/ui/table/PaginatedDataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  BinderDetailDrawer,
  buildBindersColumns,
  BindersFiltersBar,
  ReceiveBinderDrawer,
  useBindersPage,
  useReceiveBinderDrawer,
} from "@/features/binders";
import { BindersPageDialogs } from "../components/dialogs/BindersPageDialogs";
import { useBindersPageDialogs } from "../hooks/useBindersPageDialogs";
import { useState } from "react";

export const Binders: React.FC = () => {
  const [receiveOpen, setReceiveOpen] = useState(false);

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
    getSelectedBinder: () => selectedBinder,
    markReadyBulk,
    returnBinder,
    deleteBinder,
    handoverBinders,
  });

  const receive = useReceiveBinderDrawer({
    onSuccess: () => setReceiveOpen(false),
  });

  const detailOpen = deepLinkBinderId !== undefined;

  const getBinderNumberLabel = (binderId: number | null) => {
    if (binderId == null) return null;
    const fromList = binders.find((b) => b.id === binderId);
    if (fromList?.binder_number) return fromList.binder_number;
    if (selectedBinder?.id === binderId) return selectedBinder.binder_number;
    return `#${binderId}`;
  };

  const columns = useMemo(
    () =>
      buildBindersColumns({
        actionLoadingId,
        onMarkReady: (id) => void markReady(id),
        onRevertReady: (id) => void revertReady(id),
        onReturn: dialogs.openReturnDialog,
        onOpenDetail: (id) => handleSelectBinder({ id }),
        onDelete: dialogs.openDeleteDialog,
        onBulkReady: (binder) => dialogs.openBulkReadyDialog(binder),
        onHandover: (binder) => dialogs.openHandoverDialog(binder),
      }),
    [actionLoadingId, dialogs, markReady, revertReady, handleSelectBinder],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="קלסרים"
        description="רשימת הקלסרים במשרד — סינון לפי סטטוס, תקופה וחיפוש חופשי"
        actions={
          <Button variant="primary" size="sm" onClick={() => setReceiveOpen(true)}>
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
        onRowClick={(binder) => handleSelectBinder(binder)}
        page={filters.page}
        pageSize={filters.page_size}
        total={total}
        onPageChange={setPage}
        emptyMessage="אין קלסרים התואמים לסינון הנוכחי"
        emptyState={{
          title: "לא נמצאו קלסרים",
          message: "נסה לאפס את הסינון, או קלוט חומר חדש.",
          action: { label: "קליטת חומר", onClick: () => setReceiveOpen(true) },
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
        onConfirmBulkReady={() => void dialogs.confirmBulkReady()}
        bulkReadyYear={dialogs.bulkReadyYear}
        bulkReadyMonth={dialogs.bulkReadyMonth}
        setBulkReadyYear={dialogs.setBulkReadyYear}
        setBulkReadyMonth={dialogs.setBulkReadyMonth}
        isMarkingReadyBulk={isMarkingReadyBulk}
        dialogBinder={dialogs.dialogBinder}
        handoverOpen={dialogs.handoverOpen}
        onCloseHandover={dialogs.closeHandoverDialog}
        onSubmitHandover={(payload) => void dialogs.submitHandover(payload)}
        isHandingOver={isHandingOver}
      />

      <BinderDetailDrawer
        open={detailOpen}
        binder={selectedBinder}
        onClose={handleCloseDrawer}
        onMarkReady={selectedBinder ? () => void markReady(selectedBinder.id) : undefined}
        onRevertReady={selectedBinder ? () => void revertReady(selectedBinder.id) : undefined}
        onReturn={selectedBinder ? () => dialogs.openReturnDialog(selectedBinder.id) : undefined}
        onBulkReady={selectedBinder ? () => dialogs.openBulkReadyDialog(selectedBinder) : undefined}
        onOpenHandover={selectedBinder ? () => dialogs.openHandoverDialog(selectedBinder) : undefined}
        onDelete={selectedBinder ? () => dialogs.openDeleteDialog(selectedBinder.id) : undefined}
        actionLoading={selectedBinder ? actionLoadingId === selectedBinder.id : false}
      />

      <ReceiveBinderDrawer
        open={receiveOpen}
        onClose={() => {
          receive.handleReset();
          setReceiveOpen(false);
        }}
        form={receive.form}
        clientQuery={receive.clientQuery}
        selectedClient={receive.selectedClient}
        businesses={receive.businesses}
        annualReports={receive.annualReports}
        hasActiveBinder={receive.hasActiveBinder}
        vatType={receive.vatType}
        onClientSelect={receive.handleClientSelect}
        onClientQueryChange={receive.handleClientQueryChange}
        onSubmit={receive.handleSubmit}
        isSubmitting={receive.isSubmitting}
      />
    </div>
  );
};
