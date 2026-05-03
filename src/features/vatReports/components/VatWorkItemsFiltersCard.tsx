import { useMemo } from 'react'
import { FilterPanel } from '@/components/ui/filters/FilterPanel'
import { VAT_PERIOD_TYPE_SELECT_OPTIONS, VAT_WORK_ITEMS_STATUS_OPTIONS } from '../constants'
import type { VatWorkItemsFiltersCardProps } from '../types'

export const VatWorkItemsFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: VatWorkItemsFiltersCardProps) => {
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return [
      { value: '', label: 'כל השנים' },
      ...Array.from({ length: 5 }, (_, i) => {
        const y = currentYear - i
        return { value: String(y), label: String(y) }
      }),
    ]
  }, [])

  const fields = useMemo(
    () => [
      { type: 'client-picker' as const, idKey: 'clientSearch' },
      { type: 'select' as const, key: 'year', label: 'שנה', options: yearOptions },
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
    [yearOptions],
  )

  return (
    <FilterPanel
      fields={fields}
      values={{
        clientSearch: filters.clientSearch ?? '',
        year: filters.year ?? '',
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
