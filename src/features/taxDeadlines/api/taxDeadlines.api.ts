import { api } from '@/api/client'
import { TAX_DEADLINE_ENDPOINTS } from './endpoints'
import { toQueryParams } from '@/api/queryParams'
import type { PaginatedResponse } from '@/types'
import type {
  TaxDeadlineResponse,
  TaxDeadlineListResponse,
  TimelineEntry,
  DeadlineUrgentItem,
  GroupedDeadlineListResponse,
} from './contracts'

export const taxDeadlinesApi = {
  createTaxDeadline: async (payload: {
    client_record_id: number
    deadline_type: string
    due_date?: string
    period?: string | null
    tax_year?: number | null
    payment_amount?: string | null
    description?: string | null
  }): Promise<TaxDeadlineResponse> => {
    const response = await api.post<TaxDeadlineResponse>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlines,
      payload,
    )
    return response.data
  },

  listTaxDeadlines: async (params: {
    client_record_id?: number
    client_name?: string
    deadline_type?: string
    status?: string
    period?: string
    due_from?: string
    due_to?: string
    page?: number
    page_size?: number
  }): Promise<TaxDeadlineListResponse> => {
    const response = await api.get<TaxDeadlineListResponse>(TAX_DEADLINE_ENDPOINTS.taxDeadlines, {
      params: toQueryParams(params),
    })
    return response.data
  },

  getTaxDeadline: async (deadlineId: number): Promise<TaxDeadlineResponse> => {
    const response = await api.get<TaxDeadlineResponse>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlineById(deadlineId),
    )
    return response.data
  },

  completeTaxDeadline: async (deadlineId: number): Promise<TaxDeadlineResponse> => {
    const response = await api.post<TaxDeadlineResponse>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlineComplete(deadlineId),
    )
    return response.data
  },

  reopenTaxDeadline: async (deadlineId: number): Promise<TaxDeadlineResponse> => {
    const response = await api.post<TaxDeadlineResponse>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlineReopen(deadlineId),
    )
    return response.data
  },

  updateTaxDeadline: async (
    deadlineId: number,
    payload: {
      deadline_type?: string
      due_date?: string
      period?: string | null
      tax_year?: number | null
      payment_amount?: string | null
      description?: string | null
    },
  ): Promise<TaxDeadlineResponse> => {
    const response = await api.put<TaxDeadlineResponse>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlineById(deadlineId),
      payload,
    )
    return response.data
  },

  deleteTaxDeadline: async (deadlineId: number): Promise<void> => {
    await api.delete(TAX_DEADLINE_ENDPOINTS.taxDeadlineById(deadlineId))
  },

  getDashboardDeadlines: async (): Promise<{
    urgent: DeadlineUrgentItem[]
    upcoming: TaxDeadlineResponse[]
  }> => {
    const response = await api.get<{
      urgent: DeadlineUrgentItem[]
      upcoming: TaxDeadlineResponse[]
    }>(TAX_DEADLINE_ENDPOINTS.taxDeadlinesDashboard)
    return response.data
  },

  getTimeline: async (clientId: number): Promise<TimelineEntry[]> => {
    const response = await api.get<PaginatedResponse<TimelineEntry>>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlinesTimeline,
      { params: toQueryParams({ client_record_id: clientId }) },
    )
    return response.data.items
  },

  generateDeadlines: async (payload: {
    client_record_id: number
    year: number
  }): Promise<{ created_count: number }> => {
    const response = await api.post<{ created_count: number }>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlinesGenerate,
      payload,
    )
    return response.data
  },

  listGroupedDeadlines: async (params: {
    status?: string
    deadline_type?: string
    due_from?: string
    due_to?: string
    client_name?: string
  }): Promise<GroupedDeadlineListResponse> => {
    const response = await api.get<GroupedDeadlineListResponse>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlinesGrouped,
      { params: toQueryParams(params) },
    )
    return response.data
  },

  listGroupClients: async (
    groupKey: string,
    params: { status?: string; page?: number; page_size?: number },
  ): Promise<PaginatedResponse<TaxDeadlineResponse>> => {
    const response = await api.get<PaginatedResponse<TaxDeadlineResponse>>(
      TAX_DEADLINE_ENDPOINTS.taxDeadlinesGroupClients(groupKey),
      { params: toQueryParams(params) },
    )
    return response.data
  },
}
