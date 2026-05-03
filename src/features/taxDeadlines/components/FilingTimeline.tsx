import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { UseFormReturn } from 'react-hook-form'
import { Select } from '../../../components/ui/inputs/Select'

import { Modal } from '../../../components/ui/overlays/Modal'
import { Input } from '../../../components/ui/inputs/Input'
import { ModalFormActions } from '../../../components/ui/overlays/ModalFormActions'
import { clientsApi, clientsQK, type VatType } from '@/features/clients'
import {
  TAX_DEADLINE_FILTER_TYPE_OPTIONS,
  TAX_DEADLINE_CREATE_FORM_ID,
  GENERATE_TAX_DEADLINES_FORM_ID,
  REQUIRED_FIELD_MESSAGE,
} from '../constants'
import { useClientTaxDeadlines } from '../hooks/useClientTaxDeadlines'
import { TaxDeadlinesTable } from './TaxDeadlinesTable'
import { DeadlineSummaryCards } from './DeadlineSummaryCards'
import { TaxDeadlineDrawer } from './TaxDeadlineDrawer'
import { EditTaxDeadlineFormModal } from './EditTaxDeadlineForm'
import { TaxDeadlineCommonFields, TaxDeadlineModalFooter } from './TaxDeadlineFormParts'
import type { TaxDeadlineResponse } from '../api'
import type { ClientDeadlineFilters } from '../hooks/useClientTaxDeadlines'
import type { CreateTaxDeadlineForm, GenerateTaxDeadlinesForm } from '../types'

interface FilingTimelineProps {
  clientId: number
}

const STATUS_FILTERS = [
  { value: '', label: 'כולם' },
  { value: 'pending', label: 'ממתין' },
  { value: 'completed', label: 'הושלם' },
  { value: 'canceled', label: 'בוטל' },
]

const getFilterYear = (filters: ClientDeadlineFilters) => {
  const year = Number(filters.due_from.slice(0, 4))
  return Number.isInteger(year) && year > 0 ? year : new Date().getFullYear()
}

const getYearOptions = () => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, index) => currentYear - 2 + index).map((year) => ({
    value: String(year),
    label: String(year),
  }))
}

const ClientDeadlineControls = ({
  filters,
  onChange,
  isAdvisor,
}: {
  filters: ClientDeadlineFilters
  onChange: (key: keyof ClientDeadlineFilters, value: string) => void
  isAdvisor: boolean
}) => {
  const selectedYear = getFilterYear(filters)
  const yearOptions = getYearOptions()

  const handleYearChange = (year: string) => {
    onChange('due_from', `${year}-01-01`)
    onChange('due_to', `${year}-12-31`)
  }

  return (
    <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {isAdvisor && (
          <Select
            value={filters.deadline_type}
            onChange={(e) => onChange('deadline_type', e.target.value)}
            options={TAX_DEADLINE_FILTER_TYPE_OPTIONS}
            className="w-full py-1.5 sm:w-56"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div className="w-full sm:w-32">
          <Select
            value={String(selectedYear)}
            onChange={(e) => handleYearChange(e.target.value)}
            options={yearOptions}
            className="w-full py-1.5"
          />
        </div>
        <div className="hidden h-9 w-px bg-gray-100 sm:block" />
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status.value || 'all'}
              type="button"
              onClick={() => onChange('status', status.value)}
              className={`whitespace-nowrap rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
                filters.status === status.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Create modal (no client picker — client pre-set) ────────────────────────

const ClientCreateDeadlineModal = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
  vatType,
}: {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  form: UseFormReturn<CreateTaxDeadlineForm>
  isSubmitting: boolean
  vatType: VatType | null | undefined
}) => (
  <Modal
    open={open}
    title="יצירת מועד מס חדש"
    onClose={onClose}
    footer={
      <TaxDeadlineModalFooter
        isSubmitting={isSubmitting}
        submitLabel="צור מועד"
        onCancel={onClose}
        onSubmit={onSubmit}
        submitForm={TAX_DEADLINE_CREATE_FORM_ID}
        submitType="submit"
      />
    }
  >
    <form id={TAX_DEADLINE_CREATE_FORM_ID} onSubmit={onSubmit} className="space-y-4">
      <TaxDeadlineCommonFields form={form} vatType={vatType ?? null} />
    </form>
  </Modal>
)

// ── Generate modal (no client picker — client pre-set) ───────────────────────

const ClientGenerateDeadlinesModal = ({
  open,
  onClose,
  onSubmit,
  form,
  isSubmitting,
}: {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  form: UseFormReturn<GenerateTaxDeadlinesForm>
  isSubmitting: boolean
}) => {
  const {
    register,
    formState: { errors },
  } = form
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="יצירת מועדים אוטומטית"
      footer={
        <ModalFormActions
          onCancel={onClose}
          isLoading={isSubmitting}
          submitForm={GENERATE_TAX_DEADLINES_FORM_ID}
          submitLabel="צור מועדים"
          submitType="submit"
        />
      }
    >
      <form id={GENERATE_TAX_DEADLINES_FORM_ID} onSubmit={onSubmit} className="space-y-4">
        <Input
          label="שנת מס *"
          type="number"
          min="2000"
          max="2100"
          {...register('year', {
            required: REQUIRED_FIELD_MESSAGE,
            validate: (value) => /^\d{4}$/.test(value) || 'יש להזין שנה בת 4 ספרות',
          })}
          error={errors.year?.message}
        />
      </form>
    </Modal>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export const FilingTimeline: React.FC<FilingTimelineProps> = ({ clientId }) => {
  const [selectedDeadline, setSelectedDeadline] = useState<TaxDeadlineResponse | null>(null)

  const {
    deadlines,
    filters,
    isLoading,
    isAdvisor,
    isCreating,
    isGenerating,
    isUpdating,
    showCreateModal,
    showGenerateModal,
    setShowCreateModal,
    setShowGenerateModal,
    handleFilterChange,
    createForm,
    onCreateSubmit,
    generateForm,
    onGenerateSubmit,
    completingId,
    reopeningId,
    deletingId,
    editingDeadline,
    editForm,
    setEditingDeadline,
    handleComplete,
    handleReopen,
    handleEdit,
    handleDelete,
    onEditSubmit,
  } = useClientTaxDeadlines(clientId)

  const clientQuery = useQuery({
    queryKey: clientsQK.detail(clientId),
    queryFn: () => clientsApi.getById(clientId),
    enabled: showCreateModal,
  })

  return (
    <div className="space-y-4">
      <DeadlineSummaryCards deadlines={deadlines} />

      <ClientDeadlineControls
        filters={filters}
        onChange={handleFilterChange}
        isAdvisor={isAdvisor}
      />

      <TaxDeadlinesTable
        deadlines={deadlines}
        isLoading={isLoading}
        clientScoped
        completingId={completingId}
        reopeningId={reopeningId}
        deletingId={deletingId}
        onComplete={isAdvisor ? handleComplete : undefined}
        onReopen={isAdvisor ? handleReopen : undefined}
        onEdit={isAdvisor ? handleEdit : undefined}
        onDelete={isAdvisor ? handleDelete : undefined}
        onRowClick={setSelectedDeadline}
      />

      <TaxDeadlineDrawer deadline={selectedDeadline} onClose={() => setSelectedDeadline(null)} />

      {isAdvisor && (
        <ClientCreateDeadlineModal
          open={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            createForm.reset({ client_id: String(clientId) })
          }}
          onSubmit={onCreateSubmit}
          form={createForm}
          isSubmitting={isCreating}
          vatType={clientQuery.data?.vat_reporting_frequency}
        />
      )}

      {isAdvisor && (
        <ClientGenerateDeadlinesModal
          open={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onSubmit={onGenerateSubmit}
          form={generateForm}
          isSubmitting={isGenerating}
        />
      )}

      {isAdvisor && (
        <EditTaxDeadlineFormModal
          open={Boolean(editingDeadline)}
          onClose={() => setEditingDeadline(null)}
          onSubmit={onEditSubmit}
          form={editForm}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  )
}

FilingTimeline.displayName = 'FilingTimeline'
