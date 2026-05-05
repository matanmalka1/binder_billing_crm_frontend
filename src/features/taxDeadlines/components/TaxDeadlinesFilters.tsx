import { FilterPanel } from '@/components/ui/filters/FilterPanel'
import { TAX_DEADLINE_FILTER_TYPE_OPTIONS, TAX_DEADLINE_STATUS_OPTIONS } from '../constants'
import type { TaxDeadlineFilters } from '../types'

interface TaxDeadlinesFiltersProps {
  filters: TaxDeadlineFilters
  onChange: (key: string, value: string) => void
  onMultiChange?: (updates: Record<string, string>) => void
}

const FIELDS = [
  { type: 'client-picker' as const, idKey: 'client_id', nameKey: 'client_name', label: 'חיפוש לקוח' },
  {
    type: 'select' as const,
    key: 'deadline_type',
    label: 'סוג מועד',
    options: TAX_DEADLINE_FILTER_TYPE_OPTIONS,
  },
  { type: 'select' as const, key: 'status', label: 'סטטוס', options: TAX_DEADLINE_STATUS_OPTIONS },
  {
    type: 'date-range' as const,
    fromKey: 'due_from',
    toKey: 'due_to',
    fromLabel: 'מתאריך',
    toLabel: 'עד תאריך',
  },
]

export const TaxDeadlinesFilters = ({ filters, onChange, onMultiChange }: TaxDeadlinesFiltersProps) => (
  <FilterPanel
    fields={FIELDS}
    values={{
      client_id: filters.client_id ?? '',
      client_name: filters.client_name ?? '',
      deadline_type: filters.deadline_type ?? '',
      status: filters.status ?? '',
      due_from: filters.due_from ?? '',
      due_to: filters.due_to ?? '',
    }}
    onChange={onChange}
    onMultiChange={onMultiChange}
    onReset={() => {
      if (onMultiChange) {
        onMultiChange({ client_id: '', client_name: '', deadline_type: '', status: '', due_from: '', due_to: '' })
      } else {
        onChange('client_id', '')
        onChange('client_name', '')
        onChange('deadline_type', '')
        onChange('status', '')
        onChange('due_from', '')
        onChange('due_to', '')
      }
    }}
    gridClass="grid-cols-1 sm:grid-cols-3"
  />
)

TaxDeadlinesFilters.displayName = 'TaxDeadlinesFilters'
