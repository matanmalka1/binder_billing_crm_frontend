import { FilterPanel } from '@/components/ui/filters/FilterPanel'
import { STATUS_LABELS } from '../../api/utils'
import type { AnnualReportStatus } from '../../api/contracts'
import { ALL_STATUSES_OPTION, ALL_YEARS_OPTION } from '@/constants/filterOptions.constants'
import { getActiveReportYearOptions, getOperationalTaxYear } from '@/constants/periodOptions.constants'

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

const getFields = () => [
  { type: 'client-picker' as const, idKey: 'client_id', nameKey: 'client_name' },
  { type: 'select' as const, key: 'status', label: 'סטטוס', options: STATUS_OPTIONS },
  {
    type: 'select' as const,
    key: 'year',
    label: 'שנת מס',
    options: [ALL_YEARS_OPTION, ...getActiveReportYearOptions()],
    defaultValue: String(getOperationalTaxYear()),
  },
]

export const AnnualReportsFiltersBar: React.FC<AnnualReportsFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => (
  <FilterPanel
    fields={getFields()}
    values={filters}
    onChange={(key, value) => onFilterChange(key as keyof AnnualReportsFilters, value)}
    onReset={onReset}
  />
)

AnnualReportsFiltersBar.displayName = 'AnnualReportsFiltersBar'
