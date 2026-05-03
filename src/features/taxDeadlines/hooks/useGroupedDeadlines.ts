import { useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParamFilters } from '../../../hooks/useSearchParamFilters'
import { useRole } from '../../../hooks/useRole'
import { taxDeadlinesApi, taxDeadlinesQK } from '../api'
import { toOptionalString } from '../../../utils/filters'
import { getErrorMessage } from '../../../utils/utils'
import type { TaxDeadlineFilters } from '../types'

export const useGroupedDeadlines = () => {
  const { isAdvisor } = useRole()
  const { searchParams, setFilter, setSearchParams } = useSearchParamFilters()

  const defaultWindow = useMemo(() => {
    const today = new Date()
    const from = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const end = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())
    const to = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
    return { from, to }
  }, [])

  // Write default window to URL on mount so the view is bookmarkable
  useEffect(() => {
    if (searchParams.get('due_from') || searchParams.get('due_to')) return
    const next = new URLSearchParams(searchParams)
    next.set('due_from', defaultWindow.from)
    next.set('due_to', defaultWindow.to)
    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filters: Omit<TaxDeadlineFilters, 'page' | 'page_size'> = useMemo(
    () => ({
      client_name: searchParams.get('client_name') || '',
      deadline_type: searchParams.get('deadline_type') || '',
      status: searchParams.has('status') ? (searchParams.get('status') ?? '') : 'pending',
      due_from: searchParams.get('due_from') || '',
      due_to: searchParams.get('due_to') || '',
    }),
    [searchParams],
  )

  const apiParams = useMemo(
    () => ({
      client_name: toOptionalString(filters.client_name),
      deadline_type: toOptionalString(filters.deadline_type),
      status: toOptionalString(filters.status),
      due_from: toOptionalString(filters.due_from),
      due_to: toOptionalString(filters.due_to),
    }),
    [filters],
  )

  const groupedQuery = useQuery({
    queryKey: taxDeadlinesQK.grouped(apiParams),
    queryFn: () => taxDeadlinesApi.listGroupedDeadlines(apiParams),
  })

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'client_name') setFilter('business_name', '')
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return {
    filters,
    groups: groupedQuery.data?.groups ?? [],
    totalGroups: groupedQuery.data?.total_groups ?? 0,
    totalClientDeadlines: groupedQuery.data?.total_client_deadlines ?? 0,
    isLoading: groupedQuery.isPending,
    error: groupedQuery.error ? getErrorMessage(groupedQuery.error, 'שגיאה בטעינת מועדים') : null,
    handleFilterChange,
    isAdvisor,
  }
}
