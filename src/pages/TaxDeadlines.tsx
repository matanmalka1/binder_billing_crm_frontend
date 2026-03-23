import { useState } from "react";
import { Plus, Wand2 } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { PaginationCard } from "../components/ui/PaginationCard";
import { PageLoading } from "../components/ui/PageLoading";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { TaxDeadlinesFilters } from "../features/taxDeadlines/components/TaxDeadlinesFilters";
import { TaxDeadlinesTable } from "../features/taxDeadlines/components/TaxDeadlinesTable";
import { TaxDeadlineForm } from "../features/taxDeadlines/components/TaxDeadlineForm";
import { EditTaxDeadlineFormModal } from "../features/taxDeadlines/components/EditTaxDeadlineForm";
import { TaxDeadlineDrawer } from "../features/taxDeadlines/components/TaxDeadlineDrawer";
import { useTaxDeadlines } from "../features/taxDeadlines/hooks/useTaxDeadlines";
import { useTaxDashboard } from "../features/taxDashboard/hooks/useTaxDashboard";
import { TaxSubmissionStats } from "../features/taxDashboard/components/TaxSubmissionStats";
import { ToolbarContainer } from "../components/ui/ToolbarContainer";
import type { TaxDeadlineResponse } from "../features/taxDeadlines/api";

export const TaxDeadlines: React.FC = () => {
  const {
    filters,
    isLoading,
    error,
    isCreating,
    isUpdating,
    handleFilterChange,
    handleComplete,
    handleEdit,
    handleDelete,
    showCreateModal,
    setShowCreateModal,
    setEditingDeadline,
    editingDeadline,
    completingId,
    deletingId,
    form,
    onSubmit,
    editForm,
    onEditSubmit,
    deadlines,
    total,
    totalPages,
    handleGenerate,
    isGenerating,
    isAdvisor,
  } = useTaxDeadlines();

  const [selectedDeadline, setSelectedDeadline] = useState<TaxDeadlineResponse | null>(null);
  const { currentYear, submissions } = useTaxDashboard();
  const clientIdForGenerate = null;

  const header = (
    <PageHeader
      title="דוחות מס"
      description={`ניהול מועדי מס ומעקב הגשה לשנת ${currentYear}`}
      actions={
        <div className="flex gap-2">
          {isAdvisor && clientIdForGenerate && (
            <Button
              variant="secondary"
              onClick={() => handleGenerate(clientIdForGenerate, currentYear)}
              disabled={isGenerating}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? "יוצר..." : "צור דדליינים לשנה"}
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            מועד חדש
          </Button>
        </div>
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
        <Alert variant="error" message={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}

      <TaxSubmissionStats data={submissions} />

      <ToolbarContainer>
        <TaxDeadlinesFilters filters={filters} onChange={handleFilterChange} />
      </ToolbarContainer>

      <TaxDeadlinesTable
        deadlines={deadlines}
        onComplete={handleComplete}
        completingId={completingId}
        onRowClick={setSelectedDeadline}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
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

      <EditTaxDeadlineFormModal
        open={editingDeadline !== null}
        onClose={() => setEditingDeadline(null)}
        onSubmit={onEditSubmit}
        form={editForm}
        isSubmitting={isUpdating}
      />

      <TaxDeadlineDrawer
        deadline={selectedDeadline}
        onClose={() => setSelectedDeadline(null)}
      />
    </div>
  );
};