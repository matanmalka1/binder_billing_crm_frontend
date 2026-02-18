import { useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { DataTable } from "../components/ui/DataTable";
import { ErrorCard } from "../components/ui/ErrorCard";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { BindersFiltersBar } from "../features/binders/components/BindersFiltersBar";
import { buildBindersColumns } from "../features/binders/components/bindersColumns";
import { useBindersPage } from "../features/binders/hooks/useBindersPage";

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

  const columns = useMemo(
    () =>
      buildBindersColumns({
        activeActionKeyRef,
        onAction,
      }),
    [activeActionKeyRef, onAction],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="קלסרים"
        description="רשימת כל הקלסרים במערכת — סינון לפי מצב עבודה ו-SLA"
        variant="gradient"
      />

      <FilterBar>
        <BindersFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </FilterBar>

      {error && <ErrorCard message={error} />}

      <DataTable
        data={binders}
        columns={columns}
        getRowKey={(binder) => binder.id}
        isLoading={loading}
        emptyMessage="אין קלסרים להצגה"
      />

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
