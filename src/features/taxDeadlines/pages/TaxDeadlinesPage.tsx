import { useState } from "react";
import { CalendarPlus, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PaginationCard } from "@/components/ui/table/PaginationCard";
import { PageLoading } from "@/components/ui/layout/PageLoading";
import { Alert } from "@/components/ui/overlays/Alert";
import { Button } from "@/components/ui/primitives/Button";
import {
  EditTaxDeadlineFormModal,
  GenerateTaxDeadlinesModal,
  TaxDeadlineDrawer,
  TaxDeadlineForm,
  TaxDeadlinesFilters,
  TaxDeadlinesTable,
  useTaxDeadlines,
  type TaxDeadlineResponse,
} from "@/features/taxDeadlines";
import { DeadlineSummaryCards } from "../components/DeadlineSummaryCards";
import { TaxSubmissionStats, useTaxDashboard } from "@/features/taxDashboard";

export const TaxDeadlines: React.FC = () => {
  const {
    filters,
    isLoading,
    error,
    isCreating,
    isGenerating,
    isUpdating,
    handleFilterChange,
    handleComplete,
    handleReopen,
    handleEdit,
    handleDelete,
    showCreateModal,
    setShowCreateModal,
    setEditingDeadline,
    editingDeadline,
    completingId,
    reopeningId,
    deletingId,
    form,
    onSubmit,
    generateForm,
    onGenerateSubmit,
    editForm,
    onEditSubmit,
    deadlines,
    total,
    totalPages,
    isAdvisor,
    showGenerateModal,
    setShowGenerateModal,
  } = useTaxDeadlines();

  const [selectedDeadline, setSelectedDeadline] = useState<TaxDeadlineResponse | null>(null);
  const { currentYear, submissions } = useTaxDashboard();

  const header = (
    <PageHeader
      title="דוחות מס"
      description={`ניהול מועדי מס ומעקב הגשה לשנת ${currentYear}`}
      actions={
        <div className="flex gap-2">
          {isAdvisor && (
            <Button variant="outline" onClick={() => setShowGenerateModal(true)} className="gap-2">
              <CalendarPlus className="h-4 w-4" />
              צור מועדים
            </Button>
          )}
          {isAdvisor && (
            <Button variant="primary" onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              מועד חדש
            </Button>
          )}
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

      <TaxSubmissionStats
        data={submissions}
        activeFilter={filters.status}
        onFilter={(status) => handleFilterChange("status", status)}
      />

      <DeadlineSummaryCards deadlines={deadlines} />

      <TaxDeadlinesFilters filters={filters} onChange={handleFilterChange} />

      <TaxDeadlinesTable
        deadlines={deadlines}
        onComplete={isAdvisor ? handleComplete : undefined}
        onReopen={isAdvisor ? handleReopen : undefined}
        completingId={completingId}
        reopeningId={reopeningId}
        onRowClick={setSelectedDeadline}
        onEdit={isAdvisor ? handleEdit : undefined}
        onDelete={isAdvisor ? handleDelete : undefined}
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

      {isAdvisor && (
        <TaxDeadlineForm
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={onSubmit}
          form={form}
          isSubmitting={isCreating}
        />
      )}

      {isAdvisor && (
        <GenerateTaxDeadlinesModal
          open={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onSubmit={onGenerateSubmit}
          form={generateForm}
          isSubmitting={isGenerating}
        />
      )}

      {isAdvisor && (
        <EditTaxDeadlineFormModal
          open={editingDeadline !== null}
          onClose={() => setEditingDeadline(null)}
          onSubmit={onEditSubmit}
          form={editForm}
          isSubmitting={isUpdating}
        />
      )}

      <TaxDeadlineDrawer
        deadline={selectedDeadline}
        onClose={() => setSelectedDeadline(null)}
      />
    </div>
  );
};
