import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { PaginationCard } from "../components/ui/PaginationCard";
import { PageLoading } from "../components/ui/PageLoading";
import { ErrorCard } from "../components/ui/ErrorCard";
import { Button } from "../components/ui/Button";
import { TaxDeadlinesFilters } from "../features/taxDeadlines/components/TaxDeadlinesFilters";
import { TaxDeadlinesTable } from "../features/taxDeadlines/components/TaxDeadlinesTable";
import { TaxDeadlineForm } from "../features/taxDeadlines/components/TaxDeadlineForm";
import { TaxDeadlineDrawer } from "../features/taxDeadlines/components/TaxDeadlineDrawer";
import { useTaxDeadlines } from "../features/taxDeadlines/hooks/useTaxDeadlines";
import { useTaxDashboard } from "../features/taxDashboard/hooks/useTaxDashboard";
import { TaxSubmissionStats } from "../features/taxDashboard/components/TaxSubmissionStats";
import type { TaxDeadlineResponse } from "../api/taxDeadlines.api";

export const TaxDeadlines: React.FC = () => {
  const {
    filters,
    isLoading,
    error,
    isCreating,
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
  const { currentYear, submissions } = useTaxDashboard();

  const header = (
    <PageHeader
      title="דוחות מס"
      description={`ניהול מועדי מס ומעקב הגשה לשנת ${currentYear}`}
      variant="gradient"
      actions={
        <Button variant="primary" onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          מועד חדש
        </Button>
      }
    />
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <PageLoading message="טוען מועדי מס..." rows={6} columns={7} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorCard message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}

      <TaxSubmissionStats data={submissions} />

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
        isSubmitting={isCreating}
      />

      <TaxDeadlineDrawer
        deadline={selectedDeadline}
        onClose={() => setSelectedDeadline(null)}
      />
    </div>
  );
};