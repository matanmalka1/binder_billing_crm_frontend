import { Plus } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { PaginationCard } from "../components/ui/PaginationCard";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Button } from "../components/ui/Button";
import { getErrorMessage } from "../utils/utils";
import { TaxDeadlinesFilters } from "../features/taxDeadlines/components/TaxDeadlinesFilters";
import { TaxDeadlinesTable } from "../features/taxDeadlines/components/TaxDeadlinesTable";
import { TaxDeadlineForm } from "../features/taxDeadlines/components/TaxDeadlineForm";
import { useTaxDeadlines } from "../features/taxDeadlines/hooks/useTaxDeadlines";

export const TaxDeadlines: React.FC = () => {
  const {
    filters,
    deadlinesQuery,
    createMutation,
    handleFilterChange,
    handleComplete,
    showCreateModal,
    setShowCreateModal,
    completingId,
    form,
    onSubmit,
    deadlines,
    total,
    totalPages,
  } = useTaxDeadlines();

  const header = (
    <PageHeader
      title="מועדי מס"
      description="ניהול ומעקב אחר כל מועדי המס"
      breadcrumbs={[
        { label: "דוחות מס", to: "/tax" },
        { label: "מועדי מס", to: "/tax/deadlines" },
      ]}
      actions={
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          מועד חדש
        </Button>
      }
    />
  );

  if (deadlinesQuery.isPending) {
    return (
      <div className="space-y-6">
        {header}
        <PageLoading message="טוען מועדי מס..." rows={6} columns={7} />
      </div>
    );
  }

  if (deadlinesQuery.error) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorCard
          message={getErrorMessage(deadlinesQuery.error, "שגיאה בטעינת מועדים")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}

      <TaxDeadlinesFilters filters={filters} onChange={handleFilterChange} />

      <TaxDeadlinesTable
        deadlines={deadlines}
        onComplete={handleComplete}
        completingId={completingId}
      />

      {total > 0 && (
        <PaginationCard
          page={filters.page}
          totalPages={totalPages}
          total={total}
          label="מועדים"
          onPageChange={(page) => handleFilterChange("page", String(page))}
        />
      )}

      <TaxDeadlineForm
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onSubmit}
        form={form}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};