import { Plus } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
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
        variant="gradient"
      />

      <Card title="בחירת לקוח ושנה">
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
      </Card>

      {error && <ErrorCard message={error} />}

      {hasClientSelected && (
        <AdvancePaymentSummary totalExpected={totalExpected} totalPaid={totalPaid} />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">מקדמות חודשיות</h3>
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
      </div>

      <AdvancePaymentTable rows={rows} isLoading={isLoading} />

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