import { FilterPanel } from '@/components/ui/filters/FilterPanel'
import {
  DEFAULT_REMINDER_STATUS_FILTER,
  REMINDER_DUE_FILTER_LABELS,
  REMINDER_STATUS_OPTIONS,
  REMINDER_TYPE_OPTIONS,
  type ReminderDueFilter,
} from '../constants'

interface RemindersFiltersBarProps {
  search: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  dueFilter?: ReminderDueFilter
  onDueClear: () => void
  hasFilters: boolean
  onClear: () => void
}

const FIELDS = [
  {
    type: 'search' as const,
    key: 'search',
    label: 'חיפוש',
    placeholder: 'שם, עסק, ת.ז. / ח.פ או הודעה...',
  },
  { type: 'select' as const, key: 'type', label: 'סוג תזכורת', options: REMINDER_TYPE_OPTIONS },
  {
    type: 'select' as const,
    key: 'status',
    label: 'סטטוס',
    options: REMINDER_STATUS_OPTIONS,
    defaultValue: DEFAULT_REMINDER_STATUS_FILTER,
  },
]

export const RemindersFiltersBar: React.FC<RemindersFiltersBarProps> = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  dueFilter,
  onDueClear,
  onClear,
}) => {
  const dueBadge = dueFilter
    ? [{ key: 'dueFilter', label: REMINDER_DUE_FILTER_LABELS[dueFilter], onRemove: onDueClear }]
    : []

  return (
    <FilterPanel
      fields={FIELDS}
      values={{ search, type: typeFilter, status: statusFilter }}
      onChange={(key, value) => {
        if (key === 'search') onSearchChange(value)
        else if (key === 'type') onTypeChange(value)
        else if (key === 'status') onStatusChange(value)
      }}
      onReset={onClear}
      gridClass="grid-cols-1 lg:grid-cols-3"
      extraBadges={dueBadge}
    />
  )
}
