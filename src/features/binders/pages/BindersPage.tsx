import { useMemo, useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { Input } from "@/components/ui/inputs/Input";
import { Select } from "@/components/ui/inputs/Select";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Modal } from "@/components/ui/overlays/Modal";
import { PaginatedDataTable } from "@/components/ui/table/PaginatedDataTable";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  BinderDrawer,
  BinderHandoverPanel,
  buildBindersColumns,
  BindersFiltersBar,
  useBindersPage,
  useReceiveBinderDrawer,
} from "@/features/binders";
import { buildYearOptions } from "@/utils/utils";

type DrawerMode = "detail" | "receive" | null;

const YEAR_OPTIONS = buildYearOptions().map((option) => ({ ...option, disabled: false as const }));
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1).padStart(2, "0"),
  disabled: false as const,
}));

export const Binders: React.FC = () => {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [confirmDeleteForId, setConfirmDeleteForId] = useState<number | null>(null);
  const [confirmReturnForId, setConfirmReturnForId] = useState<number | null>(null);
  const [pickupPersonName, setPickupPersonName] = useState("");
  const [bulkReadyOpen, setBulkReadyOpen] = useState(false);
  const [handoverOpen, setHandoverOpen] = useState(false);
  const [bulkReadyYear, setBulkReadyYear] = useState(new Date().getFullYear());
  const [bulkReadyMonth, setBulkReadyMonth] = useState(new Date().getMonth() + 1);

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

  const handleBulkReadyConfirm = async () => {
    if (!selectedBinder) return;
    await markReadyBulk(selectedBinder.client_id, bulkReadyYear, bulkReadyMonth);
    setBulkReadyOpen(false);
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
      }),
    [actionLoadingId, markReady, revertReady, handleSelectBinder],
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
        <Input
          type="text"
          placeholder="שם האיש המאסף (אופציונלי)"
          value={pickupPersonName}
          onChange={(e) => setPickupPersonName(e.target.value)}
          className="mt-3"
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

      <Modal
        open={bulkReadyOpen}
        title="סימון עד תקופה כמוכן לאיסוף"
        onClose={() => setBulkReadyOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setBulkReadyOpen(false)}>
              ביטול
            </Button>
            <Button
              type="button"
              isLoading={isMarkingReadyBulk}
              disabled={!selectedBinder}
              onClick={() => void handleBulkReadyConfirm()}
            >
              סמן כמוכן
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            הפעולה תסמן את כל הקלסרים של הלקוח עד תקופת הדיווח שנבחרה כמוכנים לאיסוף.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="עד שנת דיווח"
              value={String(bulkReadyYear)}
              onChange={(event) => setBulkReadyYear(Number(event.target.value))}
              options={YEAR_OPTIONS}
            />
            <Select
              label="עד חודש דיווח"
              value={String(bulkReadyMonth)}
              onChange={(event) => setBulkReadyMonth(Number(event.target.value))}
              options={MONTH_OPTIONS}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={handoverOpen}
        title="מסירת קלסרים"
        onClose={() => setHandoverOpen(false)}
        footer={
          <div className="flex items-center justify-end">
            <Button type="button" variant="secondary" onClick={() => setHandoverOpen(false)}>
              סגור
            </Button>
          </div>
        }
      >
        {selectedBinder ? (
          <BinderHandoverPanel
            clientId={selectedBinder.client_id}
            initialBinderId={selectedBinder.id}
            isSubmitting={isHandingOver}
            onSubmit={(payload) =>
              void handoverBinders(
                selectedBinder.client_id,
                payload.binderIds,
                payload.receivedByName,
                payload.handedOverAt,
                payload.untilPeriodYear,
                payload.untilPeriodMonth,
                payload.notes,
              ).then(() => setHandoverOpen(false))
            }
          />
        ) : null}
      </Modal>

      <BinderDrawer
        open={drawerOpen}
        mode={effectiveMode}
        binder={selectedBinder}
        onClose={handleCloseDrawerAll}
        onMarkReady={selectedBinder ? () => void markReady(selectedBinder.id) : undefined}
        onRevertReady={selectedBinder ? () => void revertReady(selectedBinder.id) : undefined}
        onReturn={selectedBinder ? () => setConfirmReturnForId(selectedBinder.id) : undefined}
        onBulkReady={selectedBinder ? () => setBulkReadyOpen(true) : undefined}
        onOpenHandover={selectedBinder ? () => setHandoverOpen(true) : undefined}
        onDelete={selectedBinder ? () => setConfirmDeleteForId(selectedBinder.id) : undefined}
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
