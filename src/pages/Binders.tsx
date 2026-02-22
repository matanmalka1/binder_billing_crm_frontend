import { useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { DataTable } from "../components/ui/DataTable";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { BindersFiltersBar } from "../features/binders/components/BindersFiltersBar";
import { buildBindersColumns } from "../features/binders/components/bindersColumns";
import { ReceiveBinderModal } from "../features/binders/components/ReceiveBinderModal";
import { useBindersPage } from "../features/binders/hooks/useBindersPage";
import { useReceiveBinderModal } from "../features/binders/hooks/useReceiveBinderModal";

export const Binders: React.FC = () => {
  const {
    activeActionKey,
    activeActionKeyRef,
    binders,
    cancelPendingAction,
    confirmPendingAction,
    error,
    filters,
    onAction,
    handleFilterChange,
    loading,
    pendingAction,
  } = useBindersPage();

  const receiveModal = useReceiveBinderModal();

  const columns = useMemo(
    () => buildBindersColumns({ activeActionKeyRef, onAction }),
    [activeActionKeyRef, onAction],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="קלסרים"
        description="רשימת כל הקלסרים במערכת — סינון לפי סטטוס ומצב עבודה"
        variant="gradient"
        actions={
          <Button variant="primary" onClick={receiveModal.handleOpen}>
            קליטת חומר
          </Button>
        }
      />

      <FilterBar title="סינון קלסרים">
        <BindersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </FilterBar>

      {error && <ErrorCard message={error} />}

      <DataTable
        data={binders}
        columns={columns}
        getRowKey={(binder) => binder.id}
        isLoading={loading}
        emptyMessage="אין קלסרים התואמים לסינון הנוכחי"
        emptyState={{
          title: "לא נמצאו קלסרים",
          message: "נסה לאפס את הסינון או לחפש עם פרמטרים שונים",
        }}
      />

      <ReceiveBinderModal
        open={receiveModal.open}
        form={receiveModal.form}
        clientQuery={receiveModal.clientQuery}
        selectedClient={receiveModal.selectedClient}
        isSubmitting={receiveModal.isSubmitting}
        onClose={receiveModal.handleClose}
        onSubmit={receiveModal.handleSubmit}
        onClientSelect={receiveModal.handleClientSelect}
        onClientQueryChange={receiveModal.handleClientQueryChange}
      />

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
    </div>
  );
};
