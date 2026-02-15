import { Card } from "../components/ui/Card";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
import { PendingActionDialog } from "../features/actions/components/PendingActionDialog";
import { BindersFiltersBar } from "../features/binders/components/BindersFiltersBar";
import { BindersTableCard } from "../features/binders/components/BindersTableCard";
import { useBindersPage } from "../features/binders/hooks/useBindersPage";

export const Binders: React.FC = () => {
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
      <header>
        <h2 className="text-2xl font-bold text-gray-900">תיקים</h2>
        <p className="text-gray-600">רשימת כל התיקים במערכת</p>
      </header>
      <Card title="סינון">
        <BindersFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </Card>
      {loading && <PageLoading />}
      {error && <ErrorCard message={error} />}
      {!loading && !error && binders.length === 0 && (
        <Card>
          <p className="text-center text-gray-600">אין תיקים להצגה</p>
        </Card>
      )}
      {!loading && !error && binders.length > 0 && (
        <BindersTableCard
          binders={binders}
          activeActionKey={activeActionKey}
          onActionClick={handleActionClick}
        />
      )}
      <PendingActionDialog
        pendingAction={pendingAction}
        activeActionKey={activeActionKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </div>
  );
};
