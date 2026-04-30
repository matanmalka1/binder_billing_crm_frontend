import { useSearchDebounce } from '../../../hooks/useSearchDebounce'
import { Search, X } from 'lucide-react'
import { Input } from '../../../components/ui/inputs/Input'
import { Select } from '../../../components/ui/inputs/Select'
import { DatePicker } from '../../../components/ui/inputs/DatePicker'
import { ToolbarContainer } from '../../../components/ui/layout/ToolbarContainer'
import { ActiveFilterBadges } from '../../../components/ui/table/ActiveFilterBadges'
import { cn } from '../../../utils/utils'
import {
  TAX_DEADLINE_FILTER_TYPE_OPTIONS,
  TAX_DEADLINE_STATUS_OPTIONS,
  getTaxDeadlineStatusLabel,
  getTaxDeadlineTypeLabel,
} from '../constants'
import type { TaxDeadlineFilters } from '../types'

interface TaxDeadlinesFiltersProps {
  filters: TaxDeadlineFilters
  onChange: (key: string, value: string) => void
}

export const TaxDeadlinesFilters = ({ filters, onChange }: TaxDeadlinesFiltersProps) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(filters.client_name ?? '', (v) =>
    onChange('client_name', v),
  )

  const handleReset = () => {
    setSearchDraft('')
    onChange('client_name', '')
    onChange('deadline_type', '')
    onChange('status', '')
    onChange('due_from', '')
    onChange('due_to', '')
  }

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            label="חיפוש לקוח"
            type="text"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="שם לקוח..."
            startIcon={<Search className="h-4 w-4" />}
            endElement={
              searchDraft ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchDraft('')
                    onChange('client_name', '')
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />
          <Select
            label="סוג מועד"
            value={filters.deadline_type}
            onChange={(e) => onChange('deadline_type', e.target.value)}
            options={TAX_DEADLINE_FILTER_TYPE_OPTIONS}
            className={cn(filters.deadline_type && 'border-primary-400 ring-1 ring-primary-200')}
          />
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
            options={TAX_DEADLINE_STATUS_OPTIONS}
            className={cn(filters.status && 'border-primary-400 ring-1 ring-primary-200')}
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

        <ActiveFilterBadges
          badges={[
            filters.client_name
              ? {
                  key: 'client_name',
                  label: `לקוח: ${filters.client_name}`,
                  onRemove: () => {
                    setSearchDraft('')
                    onChange('client_name', '')
                  },
                }
              : null,
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
          onReset={handleReset}
        />
      </div>
    </ToolbarContainer>
  )
}

TaxDeadlinesFilters.displayName = 'TaxDeadlinesFilters'
