import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { AdvancePaymentSummary } from "../../features/advancedPayments/components/AdvancePaymentSummary";
import { AdvancePaymentTable } from "../../features/advancedPayments/components/AdvancePaymentTable";
import { useAdvancePayments } from "../../features/advancedPayments/hooks/useAdvancePayments";
import { useAdvancePaymentFilters } from "../../features/advancedPayments/hooks/useAdvancePaymentFilters";
import { Button } from "../../components/ui/Button";
import { Plus } from "lucide-react";
import { CreateAdvancePaymentModal } from "../../features/advancedPayments/components/CreateAdvancePaymentModal";
import { useState } from "react";

export const AdvancePayments: React.FC = () => {
  const { filters, setFilter } = useAdvancePaymentFilters();
  const { rows, isLoading, error, totalExpected, totalPaid, create, isCreating } =
    useAdvancePayments(filters.client_id, filters.year);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="מחשבון מקדמות"
        description="מעקב תשלומי מקדמה חודשיים לכל לקוח"
        variant="gradient"
      />

      <Card title="בחירת לקוח ושנה">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-md">
          <Input
            label="מזהה לקוח"
            type="number"
            min={1}
            value={filters.client_id || ""}
            onChange={(e) => setFilter("client_id", Number(e.target.value))}
            placeholder="#123"
          />
          <Input
            label="שנת מס"
            type="number"
            min={2000}
            max={2100}
            value={filters.year}
            onChange={(e) => setFilter("year", Number(e.target.value))}
          />
        </div>
      </Card>

      {error && <ErrorCard message={error} />}

      {filters.client_id > 0 && (
        <AdvancePaymentSummary
          totalExpected={totalExpected}
          totalPaid={totalPaid}
        />
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
