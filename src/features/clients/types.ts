import type { ClientStatus, ListClientsParams } from './api'
import type { ClientSortBy, ClientSortOrder } from './constants'

export interface ClientsFilters extends ListClientsParams {
  search: string
  status?: ClientStatus
  sort_by: ClientSortBy
  sort_order: ClientSortOrder
}

export interface ClientsFiltersBarProps {
  filters: ClientsFilters
  onFilterChange: (
    name: 'accountant_id' | 'page_size' | 'search' | 'status' | 'sort_by' | 'sort_order',
    value: string,
  ) => void
  onReset: () => void
  showAccountantFilter?: boolean
}
