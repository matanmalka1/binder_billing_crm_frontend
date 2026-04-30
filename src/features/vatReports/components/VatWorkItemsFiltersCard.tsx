import { useMemo, useState, useEffect } from 'react'
import { Select } from '../../../components/ui/inputs/Select'
import { ActiveFilterBadges } from '../../../components/ui/table/ActiveFilterBadges'
import { ToolbarContainer } from '../../../components/ui/layout/ToolbarContainer'
import { ClientFilterControl } from '@/components/shared/client/ClientFilterControl'
import { cn, MONTH_NAMES } from '../../../utils/utils'
import {
  VAT_PERIOD_TYPE_OPTIONS,
  VAT_PERIOD_TYPE_SELECT_OPTIONS,
  VAT_WORK_ITEMS_STATUS_OPTIONS,
} from '../constants'
import type { VatWorkItemsFiltersCardProps } from '../types'

export const VatWorkItemsFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: VatWorkItemsFiltersCardProps) => {
  const [clientQuery, setClientQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null)

  const periodOptions = useMemo(
    () => [
      { value: '', label: 'כל התקופות' },
      ...Array.from({ length: 24 }, (_, i) => {
        const periodDate = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1)
        return {
          value: `${periodDate.getFullYear()}-${String(periodDate.getMonth() + 1).padStart(2, '0')}`,
          label: `${MONTH_NAMES[periodDate.getMonth()]} ${periodDate.getFullYear()}`,
        }
      }),
    ],
    [],
  )

  // Sync local state when filter is cleared externally
  useEffect(() => {
    if (!filters.clientSearch) {
      setSelectedClient(null)
      setClientQuery('')
    }
  }, [filters.clientSearch])

  const handleSelectClient = (client: { id: number; name: string }) => {
    setSelectedClient(client)
    setClientQuery(client.name)
    onFilterChange('clientSearch', String(client.id))
  }

  const handleClearClient = () => {
    onFilterChange('clientSearch', '')
  }

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <ClientFilterControl
            selectedClient={selectedClient}
            clientQuery={clientQuery}
            onQueryChange={setClientQuery}
            onSelect={handleSelectClient}
            onClear={handleClearClient}
          />
          <Select
            label="תקופה"
            value={filters.period}
            onChange={(e) => onFilterChange('period', e.target.value)}
            options={periodOptions}
            className={cn(filters.period && 'border-primary-400 ring-1 ring-primary-200')}
          />
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            options={VAT_WORK_ITEMS_STATUS_OPTIONS}
            className={cn(filters.status && 'border-primary-400 ring-1 ring-primary-200')}
          />
          <Select
            label="סוג דיווח"
            value={filters.period_type}
            onChange={(e) => onFilterChange('period_type', e.target.value)}
            options={VAT_PERIOD_TYPE_SELECT_OPTIONS}
            className={cn(filters.period_type && 'border-primary-400 ring-1 ring-primary-200')}
          />
        </div>

        <ActiveFilterBadges
          badges={[
            filters.status
              ? {
                  key: 'status',
                  label:
                    VAT_WORK_ITEMS_STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ??
                    filters.status,
                  onRemove: () => onFilterChange('status', ''),
                }
              : null,
            filters.period
              ? {
                  key: 'period',
                  label: `תקופה: ${periodOptions.find((o) => o.value === filters.period)?.label ?? filters.period}`,
                  onRemove: () => onFilterChange('period', ''),
                }
              : null,
            filters.period_type
              ? {
                  key: 'period_type',
                  label:
                    VAT_PERIOD_TYPE_OPTIONS.find((o) => o.value === filters.period_type)?.label ??
                    filters.period_type,
                  onRemove: () => onFilterChange('period_type', ''),
                }
              : null,
          ].filter((b): b is NonNullable<typeof b> => b !== null)}
          onReset={onClear}
        />
      </div>
    </ToolbarContainer>
  )
}

VatWorkItemsFiltersCard.displayName = 'VatWorkItemsFiltersCard'
