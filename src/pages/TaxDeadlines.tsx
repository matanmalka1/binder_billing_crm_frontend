import { useState } from "react";
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
import { TaxDeadlineDrawer } from "../features/taxDeadlines/components/TaxDeadlineDrawer";
import { useTaxDeadlines } from "../features/taxDeadlines/hooks/useTaxDeadlines";
import { useTaxDashboard } from "../features/taxDashboard/hooks/useTaxDashboard";
import { TaxSubmissionStats } from "../features/taxDashboard/components/TaxSubmissionStats";
import { TaxUrgentDeadlines } from "../features/taxDashboard/components/TaxUrgentDeadlines";
import { TaxUpcomingDeadlines } from "../features/taxDashboard/components/TaxUpcomingDeadlines";
import type { TaxDeadlineResponse } from "../api/taxDeadlines.api";

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

  const [selectedDeadline, setSelectedDeadline] = useState<TaxDeadlineResponse | null>(null);

  const { currentYear, submissionsQuery, deadlinesQuery: dashDeadlinesQuery } = useTaxDashboard();

  const header = (
    <PageHeader
      title="דוחות מס"
      description={`ניהול מועדי מס ומעקב הגשה לשנת ${currentYear}`}
      variant="gradient"
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

      {/* Dashboard summary section */}
      <TaxSubmissionStats data={submissionsQuery.data} />

      {dashDeadlinesQuery.data && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TaxUrgentDeadlines items={dashDeadlinesQuery.data.urgent} />
          </div>
          <div>
            <TaxUpcomingDeadlines items={dashDeadlinesQuery.data.upcoming} />
          </div>
        </div>
      )}

      <TaxDeadlinesFilters filters={filters} onChange={handleFilterChange} />

      <TaxDeadlinesTable
        deadlines={deadlines}
        onComplete={handleComplete}
        completingId={completingId}
        onRowClick={setSelectedDeadline}
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

      <TaxDeadlineDrawer
        deadline={selectedDeadline}
        onClose={() => setSelectedDeadline(null)}
      />
    </div>
  );
};
