import { useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { DataTable } from "../components/ui/DataTable";
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
      <PageHeader title="קלסרים" description="רשימת כל הקלסרים במערכת" />

      <FilterBar>
        <BindersFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </FilterBar>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <DataTable
          data={binders}
          columns={columns}
          getRowKey={(binder) => binder.id}
          isLoading={loading}
          emptyMessage="אין קלסרים להצגה"
        />
      </div>

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
