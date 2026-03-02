import { Plus } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { ClientSearchField } from "../../features/advancedPayments/components/ClientSearchField";
import { AdvancePaymentSummary } from "../../features/advancedPayments/components/AdvancePaymentSummary";
import { AdvancePaymentTable } from "../../features/advancedPayments/components/AdvancePaymentTable";
import { CreateAdvancePaymentModal } from "../../features/advancedPayments/components/CreateAdvancePaymentModal";
import { useAdvancePaymentsPage } from "../../features/advancedPayments/hooks/useAdvancePaymentsPage";
import { YEAR_OPTIONS } from "../../features/advancedPayments/utils";

export const AdvancePayments: React.FC = () => {
  const {
    filters,
    setFilter,
    selectedClientName,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    handleClientSelect,
    handleClientClear,
    hasClientSelected,
    rows,
    isLoading,
    error,
    totalExpected,
    totalPaid,
    create,
    isCreating,
  } = useAdvancePaymentsPage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="מחשבון מקדמות"
        description="מעקב תשלומי מקדמה חודשיים לכל לקוח"
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-transparent">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">בחירת לקוח ושנה</h3>
        </div>
        <div className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-md">
          <ClientSearchField
            selectedClientId={filters.client_id}
            selectedClientName={selectedClientName}
            onSelect={handleClientSelect}
            onClear={handleClientClear}
          />
          <Select
            label="שנת מס"
            value={String(filters.year)}
            onChange={(e) => setFilter("year", Number(e.target.value))}
            options={YEAR_OPTIONS}
          />
        </div>
        </div>
      </div>

      {error && <ErrorCard message={error} />}

      {hasClientSelected && (
        <AdvancePaymentSummary totalExpected={totalExpected} totalPaid={totalPaid} />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">מקדמות חודשיות</h3>
        <span title={!hasClientSelected ? "בחר לקוח תחילה" : undefined}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!hasClientSelected}
            onClick={openCreateModal}
          >
            <Plus className="h-4 w-4" />
            מקדמה חדשה
          </Button>
        </span>
      </div>

      {!hasClientSelected ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-500">
          <p className="text-base font-medium text-gray-700">בחר לקוח לצפייה במקדמות</p>
          <p className="mt-1 text-sm">לאחר בחירת לקוח יוצג לוח המקדמות החודשי לשנה הנבחרת</p>
        </div>
      ) : (
        <AdvancePaymentTable rows={rows} isLoading={isLoading} />
      )}

      <CreateAdvancePaymentModal
        open={isCreateModalOpen}
        clientId={filters.client_id}
        year={filters.year}
        onClose={closeCreateModal}
        onCreate={create}
        isCreating={isCreating}
      />
    </div>
  );
};