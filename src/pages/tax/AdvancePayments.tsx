import { useState } from "react";
import { getYear } from "date-fns";
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
import { useAdvancePayments } from "../../features/advancedPayments/hooks/useAdvancePayments";
import { useAdvancePaymentFilters } from "../../features/advancedPayments/hooks/useAdvancePaymentFilters";

const CURRENT_YEAR = getYear(new Date());
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => ({
  value: String(CURRENT_YEAR - i),
  label: String(CURRENT_YEAR - i),
}));

export const AdvancePayments: React.FC = () => {
  const { filters, setFilter } = useAdvancePaymentFilters();
  const [selectedClientName, setSelectedClientName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const { rows, isLoading, error, totalExpected, totalPaid, create, isCreating } =
    useAdvancePayments(filters.client_id, filters.year);

  const handleClientSelect = (id: number, name: string) => {
    setSelectedClientName(name);
    setFilter("client_id", id);
  };

  const handleClientClear = () => {
    setSelectedClientName("");
    setFilter("client_id", 0);
  };

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

      {filters.client_id > 0 && (
        <AdvancePaymentSummary totalExpected={totalExpected} totalPaid={totalPaid} />
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">מקדמות חודשיות</h3>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={filters.client_id <= 0}
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-4 w-4" />
          מקדמה חדשה
        </Button>
      </div>

      <AdvancePaymentTable rows={rows} isLoading={isLoading} />

      <CreateAdvancePaymentModal
        open={showCreate}
        clientId={filters.client_id}
        year={filters.year}
        onClose={() => setShowCreate(false)}
        onCreate={create}
        isCreating={isCreating}
      />
    </div>
  );
};