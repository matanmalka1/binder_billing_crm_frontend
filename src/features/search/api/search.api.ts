import { api } from '@/api/client'
import { SEARCH_ENDPOINTS } from './endpoints'
import { toQueryParams } from '@/api/queryParams'
import type { SearchParams, SearchResponse } from './contracts'

export const searchApi = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const queryParams = toQueryParams(params)
    const response = await api.get<SearchResponse>(SEARCH_ENDPOINTS.search, {
      params: queryParams,
    })
    return response.data
  },
}
