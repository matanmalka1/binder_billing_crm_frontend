import { useQuery } from '@tanstack/react-query'
import { vatReportsApi, vatReportsQK } from '../api'
import type { VatWorkItemGroupSummary } from '../api'

interface UseVatWorkItemGroupsParams {
  period_type?: string
  status?: string
  client_name?: string
  year?: number
}

export const useVatWorkItemGroups = (params: UseVatWorkItemGroupsParams = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: vatReportsQK.groups(params),
    queryFn: () => vatReportsApi.listGroups(params),
    staleTime: 30_000,
  })

  return {
    groups: (data?.groups ?? []) as VatWorkItemGroupSummary[],
    isLoading,
    error: error ? 'שגיאה בטעינת קבוצות תיקי מע"מ' : null,
  }
}
