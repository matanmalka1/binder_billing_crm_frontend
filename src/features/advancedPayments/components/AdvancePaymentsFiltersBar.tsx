import { FilterPanel } from '@/components/ui/filters/FilterPanel'
import { getOperationalYearOptions } from '@/constants/periodOptions.constants'
import {
  ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL,
  ADVANCE_PAYMENT_MONTH_FILTER_OPTIONS,
} from '../constants'
import type { AdvancePaymentStatus } from '../types'

interface AdvancePaymentsFiltersBarProps {
  year: number
  month: number
  status: AdvancePaymentStatus | ''
  onParamChange: (key: string, value: string) => void
}

const FIELDS = [
  { type: 'select' as const, key: 'year', label: 'שנת מס', options: getOperationalYearOptions() },
  {
    type: 'select' as const,
    key: 'month',
    label: 'חודש',
    options: ADVANCE_PAYMENT_MONTH_FILTER_OPTIONS,
  },
  {
    type: 'select' as const,
    key: 'status',
    label: 'סטטוס',
    options: ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL,
  },
]

export const AdvancePaymentsFiltersBar = ({
  year,
  month,
  status,
  onParamChange,
}: AdvancePaymentsFiltersBarProps) => (
  <FilterPanel
    fields={FIELDS}
    values={{
      year: String(year),
      month: month > 0 ? String(month) : '',
      status,
    }}
    onChange={onParamChange}
    onReset={() => {
      onParamChange('month', '')
      onParamChange('status', '')
    }}
  />
)

AdvancePaymentsFiltersBar.displayName = 'AdvancePaymentsFiltersBar'
