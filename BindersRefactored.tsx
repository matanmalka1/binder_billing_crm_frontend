import { FolderOpen } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { PaginatedTableView } from "../components/ui/PaginatedTableView";
import { ConfirmDialog } from "../features/actions/components/ConfirmDialog";
import { BindersFiltersBar } from "../features/binders/components/BindersFiltersBar";
import { BindersTableCard } from "../features/binders/components/BindersTableCard";
import { useBindersPage } from "../features/binders/hooks/useBindersPage";

export const BindersRefactored: React.FC = () => {
  const {
    activeActionKey,
    binders,
    cancelPendingAction,
    confirmPendingAction,
    error,
    filters,
    handleActionClick,
    handleFilterChange,
    loading,
    pendingAction,
  } = useBindersPage();

  return (
    <div className="space-y-6">
      {/* Standardized Header */}
      <PageHeader
        title="תיקים"
        description="רשימת כל התיקים במערכת"
      />

      {/* Standardized Filter Bar */}
      <FilterBar>
        <BindersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </FilterBar>

      {/* Standardized Table View with Pagination */}
      <PaginatedTableView
        data={binders}
        loading={loading}
        error={error}
        pagination={{
          page: 1,
          pageSize: 20,
          total: binders.length,
          onPageChange: () => {},
        }}
        renderTable={(data) => (
          <BindersTableCard
            binders={data}
            activeActionKey={activeActionKey}
            onActionClick={handleActionClick}
          />
        )}
        emptyState={{
          icon: FolderOpen,
          message: "אין תיקים להצגה",
        }}
      />

      {/* Standardized Confirm Dialog */}
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
