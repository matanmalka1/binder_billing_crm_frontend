import { useState } from 'react'
import { CalendarPlus, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLoading } from '@/components/ui/layout/PageLoading'
import { Alert } from '@/components/ui/overlays/Alert'
import { Button } from '@/components/ui/primitives/Button'
import {
  EditTaxDeadlineFormModal,
  GenerateTaxDeadlinesModal,
  TaxDeadlineDrawer,
  TaxDeadlineForm,
  TaxDeadlinesFilters,
  useTaxDeadlines,
  type TaxDeadlineResponse,
} from '@/features/taxDeadlines'
import { TaxDeadlinesGroupedTable } from '../components/TaxDeadlinesGroupedTable'
import { DeadlineGroupSummaryCards } from '../components/DeadlineGroupSummaryCards'
import { useGroupedDeadlines } from '../hooks/useGroupedDeadlines'

export const TaxDeadlines: React.FC = () => {
  const {
    isCreating,
    isGenerating,
    isUpdating,
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
    isAdvisor,
    showGenerateModal,
    setShowGenerateModal,
  } = useTaxDeadlines()

  const { filters, groups, isLoading, error, handleFilterChange } = useGroupedDeadlines()

  const [selectedDeadline, setSelectedDeadline] = useState<TaxDeadlineResponse | null>(null)

  const header = (
    <PageHeader
      title="בקרת מועדים"
      description="מעקב אחר מועדי מס לפי סוג, תקופה וכמות לקוחות מושפעים"
      actions={
        <div className="flex gap-2">
          {isAdvisor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGenerateModal(true)}
              className="gap-2"
            >
              צור מועדים
              <CalendarPlus className="h-4 w-4" />
            </Button>
          )}
          {isAdvisor && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="gap-2"
            >
              מועד חדש
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      }
    />
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <PageLoading message="טוען מועדי מס..." rows={6} columns={4} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {header}
        <Alert variant="error" message={error} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {header}

      <DeadlineGroupSummaryCards groups={groups} />

      <TaxDeadlinesFilters
        filters={{ ...filters, page: 1, page_size: 20 }}
        onChange={handleFilterChange}
        defaultStatus="pending"
      />

      <TaxDeadlinesGroupedTable
        groups={groups}
        onComplete={isAdvisor ? handleComplete : undefined}
        onReopen={isAdvisor ? handleReopen : undefined}
        completingId={completingId}
        reopeningId={reopeningId}
        onRowClick={setSelectedDeadline}
        onEdit={isAdvisor ? handleEdit : undefined}
        onDelete={isAdvisor ? handleDelete : undefined}
        deletingId={deletingId}
      />

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

      <TaxDeadlineDrawer deadline={selectedDeadline} onClose={() => setSelectedDeadline(null)} />
    </div>
  )
}
