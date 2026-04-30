import { useRef, useState } from 'react'
import { CalendarPlus, ChevronDown, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { UseFormReturn } from 'react-hook-form'
import { DropdownMenuItem } from '../../../components/ui/overlays/DropdownMenu'
import { useDismissibleLayer } from '../../../components/ui/overlays/useDismissibleLayer'
import { Select } from '../../../components/ui/inputs/Select'
import { DatePicker } from '../../../components/ui/inputs/DatePicker'

import { cn } from '../../../utils/utils'
import { ToolbarContainer } from '../../../components/ui/layout/ToolbarContainer'
import { ActiveFilterBadges } from '../../../components/ui/table/ActiveFilterBadges'
import { Modal } from '../../../components/ui/overlays/Modal'
import { Input } from '../../../components/ui/inputs/Input'
import { ModalFormActions } from '../../../components/ui/overlays/ModalFormActions'
import { clientsApi, clientsQK, type VatType } from '@/features/clients'
import {
  TAX_DEADLINE_FILTER_TYPE_OPTIONS,
  TAX_DEADLINE_STATUS_OPTIONS,
  getTaxDeadlineStatusLabel,
  getTaxDeadlineTypeLabel,
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

// ── Add deadline dropdown button ─────────────────────────────────────────────

const AddDeadlineMenu = ({
  onCreateManual,
  onGenerate,
}: {
  onCreateManual: () => void
  onGenerate: () => void
}) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useDismissibleLayer({
    open,
    triggerRef,
    layerRef: menuRef,
    onDismiss: () => setOpen(false),
    closeOnScroll: true,
    closeOnResize: true,
  })

  return (
    <div className="flex justify-end">
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          הוסף מועד
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <div
            ref={menuRef}
            className="absolute left-0 top-full z-50 mt-1 min-w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          >
            <DropdownMenuItem
              label="מועד ידני"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => { setOpen(false); onCreateManual() }}
            />
            <DropdownMenuItem
              label="צור מועדים אוטומטית"
              icon={<CalendarPlus className="h-4 w-4" />}
              onClick={() => { setOpen(false); onGenerate() }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Filters toolbar ──────────────────────────────────────────────────────────

const ClientDeadlineFiltersBar = ({
  filters,
  onChange,
  onReset,
}: {
  filters: ClientDeadlineFilters
  onChange: (key: keyof ClientDeadlineFilters, value: string) => void
  onReset: () => void
}) => {
  const hasFilters = Boolean(
    filters.deadline_type || filters.status || filters.due_from || filters.due_to,
  )

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="סוג מועד"
            value={filters.deadline_type}
            onChange={(e) => onChange('deadline_type', e.target.value)}
            options={TAX_DEADLINE_FILTER_TYPE_OPTIONS}
          />
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
            options={TAX_DEADLINE_STATUS_OPTIONS}
          />
          <DatePicker
            label="מתאריך"
            value={filters.due_from}
            onChange={(v) => onChange('due_from', v)}
          />
          <DatePicker
            label="עד תאריך"
            value={filters.due_to}
            onChange={(v) => onChange('due_to', v)}
          />
        </div>
        {hasFilters && (
          <ActiveFilterBadges
            badges={[
              filters.deadline_type
                ? {
                    key: 'deadline_type',
                    label: getTaxDeadlineTypeLabel(filters.deadline_type),
                    onRemove: () => onChange('deadline_type', ''),
                  }
                : null,
              filters.status
                ? {
                    key: 'status',
                    label: getTaxDeadlineStatusLabel(filters.status),
                    onRemove: () => onChange('status', ''),
                  }
                : null,
              filters.due_from
                ? {
                    key: 'due_from',
                    label: `מתאריך: ${filters.due_from}`,
                    onRemove: () => onChange('due_from', ''),
                  }
                : null,
              filters.due_to
                ? {
                    key: 'due_to',
                    label: `עד: ${filters.due_to}`,
                    onRemove: () => onChange('due_to', ''),
                  }
                : null,
            ].filter((b): b is NonNullable<typeof b> => b !== null)}
            onReset={onReset}
          />
        )}
      </div>
    </ToolbarContainer>
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
  const { register, formState: { errors } } = form
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
    handleResetFilters,
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
      {isAdvisor && (
        <AddDeadlineMenu
          onCreateManual={() => setShowCreateModal(true)}
          onGenerate={() => setShowGenerateModal(true)}
        />
      )}

      <DeadlineSummaryCards deadlines={deadlines} />

      <ClientDeadlineFiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
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
