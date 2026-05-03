import { useMemo } from 'react'
import { FilterPanel } from '@/components/ui/filters/FilterPanel'
import { MONTH_NAMES } from '../../../utils/utils'
import { VAT_PERIOD_TYPE_SELECT_OPTIONS, VAT_WORK_ITEMS_STATUS_OPTIONS } from '../constants'
import type { VatWorkItemsFiltersCardProps } from '../types'

export const VatWorkItemsFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: VatWorkItemsFiltersCardProps) => {
  const periodOptions = useMemo(
    () => [
      { value: '', label: 'כל התקופות' },
      ...Array.from({ length: 24 }, (_, i) => {
        const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1)
        return {
          value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        }
      }),
    ],
    [],
  )

  const fields = useMemo(
    () => [
      { type: 'client-picker' as const, idKey: 'clientSearch' },
      { type: 'select' as const, key: 'period', label: 'תקופה', options: periodOptions },
      {
        type: 'select' as const,
        key: 'status',
        label: 'סטטוס',
        options: VAT_WORK_ITEMS_STATUS_OPTIONS,
      },
      {
        type: 'select' as const,
        key: 'period_type',
        label: 'סוג דיווח',
        options: VAT_PERIOD_TYPE_SELECT_OPTIONS,
      },
    ],
    [periodOptions],
  )

  return (
    <FilterPanel
      fields={fields}
      values={{
        clientSearch: filters.clientSearch ?? '',
        period: filters.period ?? '',
        status: filters.status ?? '',
        period_type: filters.period_type ?? '',
      }}
      onChange={onFilterChange}
      onReset={onClear}
      gridClass="grid-cols-1 sm:grid-cols-4"
    />
  )
}

VatWorkItemsFiltersCard.displayName = 'VatWorkItemsFiltersCard'
