import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Select } from '../../../components/ui/inputs/Select'
import { ToolbarContainer } from '../../../components/ui/layout/ToolbarContainer'
import { ActiveFilterBadges } from '../../../components/ui/table/ActiveFilterBadges'
import { ClientFilterControl } from '@/components/shared/client/ClientFilterControl'
import { cn } from '../../../utils/utils'
import { CHARGE_STATUS_OPTIONS, CHARGE_TYPE_OPTIONS_WITH_ALL } from '../constants'
import { clientsApi, clientsQK } from '@/features/clients'
import type { ChargesFilters } from '../types'
import { buildChargeFilterBadges } from '../helpers'

interface ChargesFiltersCardProps {
  filters: ChargesFilters
  onClear: () => void
  onFilterChange: (key: string, value: string) => void
}

export const ChargesFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: ChargesFiltersCardProps) => {
  const [clientQuery, setClientQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null)

  const urlClientId = filters.client_record_id ? Number(filters.client_record_id) : null

  const { data: urlClient } = useQuery({
    queryKey: clientsQK.detail(urlClientId ?? 0),
    queryFn: () => clientsApi.getById(urlClientId!),
    enabled: urlClientId != null && selectedClient?.id !== urlClientId,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (urlClient && selectedClient?.id !== urlClient.id) {
      setSelectedClient({ id: urlClient.id, name: urlClient.full_name })
      setClientQuery(urlClient.full_name)
    }
  }, [urlClient, selectedClient?.id])

  useEffect(() => {
    if (!filters.client_record_id) {
      setSelectedClient(null)
      setClientQuery('')
    }
  }, [filters.client_record_id])

  const handleSelectClient = (client: { id: number; name: string }) => {
    setSelectedClient(client)
    setClientQuery(client.name)
    onFilterChange('client_record_id', String(client.id))
  }

  const handleClearClient = () => {
    onFilterChange('client_record_id', '')
  }

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ClientFilterControl
            selectedClient={selectedClient}
            clientQuery={clientQuery}
            onQueryChange={setClientQuery}
            onSelect={handleSelectClient}
            onClear={handleClearClient}
          />
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            options={CHARGE_STATUS_OPTIONS}
            className={cn(filters.status && 'border-primary-400 ring-1 ring-primary-200')}
          />
          <Select
            label="סוג חיוב"
            value={filters.charge_type}
            onChange={(e) => onFilterChange('charge_type', e.target.value)}
            options={CHARGE_TYPE_OPTIONS_WITH_ALL}
            className={cn(filters.charge_type && 'border-primary-400 ring-1 ring-primary-200')}
          />
        </div>

        <ActiveFilterBadges
          badges={buildChargeFilterBadges(filters, onFilterChange)}
          onReset={onClear}
        />
      </div>
    </ToolbarContainer>
  )
}

ChargesFiltersCard.displayName = 'ChargesFiltersCard'
