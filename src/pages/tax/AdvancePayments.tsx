import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { AdvancePaymentSummary } from "../../features/advancedPayments/components/AdvancePaymentSummary";
import { AdvancePaymentTable } from "../../features/advancedPayments/components/AdvancePaymentTable";
import { useAdvancePayments } from "../../features/advancedPayments/hooks/useAdvancePayments";
import { useAdvancePaymentFilters } from "../../features/advancedPayments/hooks/useAdvancePaymentFilters";

export const AdvancePayments: React.FC = () => {
  const { filters, setFilter } = useAdvancePaymentFilters();
  const { rows, isLoading, error, totalExpected, totalPaid } =
    useAdvancePayments(filters.client_id, filters.year);

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

      <AdvancePaymentTable rows={rows} isLoading={isLoading} />
    </div>
  );
};
