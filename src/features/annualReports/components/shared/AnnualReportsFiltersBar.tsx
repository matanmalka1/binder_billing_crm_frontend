import { FilterPanel } from '@/components/ui/filters/FilterPanel'
import { STATUS_LABELS } from '../../api/utils'
import type { AnnualReportStatus } from '../../api/contracts'
import { YEAR_OPTIONS } from '../../../../utils/utils'
import { ALL_STATUSES_OPTION, ALL_YEARS_OPTION } from '@/constants/filterOptions.constants'

export interface AnnualReportsFilters {
  client_id: string
  client_name: string
  status: string
  year: string
}

interface AnnualReportsFiltersBarProps {
  filters: AnnualReportsFilters
  onFilterChange: (key: keyof AnnualReportsFilters, value: string) => void
  onReset: () => void
}

const STATUS_OPTIONS = [
  ALL_STATUSES_OPTION,
  ...(Object.entries(STATUS_LABELS) as [AnnualReportStatus, string][]).map(([value, label]) => ({
    value,
    label,
  })),
]

const YEAR_FILTER_OPTIONS = [ALL_YEARS_OPTION, ...YEAR_OPTIONS]

const FIELDS = [
  { type: 'client-picker' as const, idKey: 'client_id', nameKey: 'client_name' },
  { type: 'select' as const, key: 'status', label: 'סטטוס', options: STATUS_OPTIONS },
  { type: 'select' as const, key: 'year', label: 'שנת מס', options: YEAR_FILTER_OPTIONS },
]

export const AnnualReportsFiltersBar: React.FC<AnnualReportsFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => (
  <FilterPanel
    fields={FIELDS}
    values={filters}
    onChange={(key, value) => onFilterChange(key as keyof AnnualReportsFilters, value)}
    onReset={onReset}
  />
)

AnnualReportsFiltersBar.displayName = 'AnnualReportsFiltersBar'
