import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { searchApi, searchQK } from '../api'
import { getErrorMessage, parsePositiveInt } from '../../../utils/utils'
import type { SearchFilters } from '../types'

export const useSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<SearchFilters>(
    () => ({
      query: searchParams.get('query') ?? '',
      client_name: searchParams.get('client_name') ?? '',
      id_number: searchParams.get('id_number') ?? '',
      binder_number: searchParams.get('binder_number') ?? '',
      page: parsePositiveInt(searchParams.get('page'), 1),
      page_size: parsePositiveInt(searchParams.get('page_size'), 20),
    }),
    [searchParams],
  )

  const hasAnyFilter =
    Boolean(filters.query) ||
    Boolean(filters.client_name) ||
    Boolean(filters.id_number) ||
    Boolean(filters.binder_number)

  const searchQuery = useQuery({
    queryKey: searchQK.results(filters),
    queryFn: () =>
      searchApi.search({
        query: filters.query || undefined,
        client_name: filters.client_name || undefined,
        id_number: filters.id_number || undefined,
        binder_number: filters.binder_number || undefined,
        page: filters.page,
        page_size: filters.page_size,
      }),
    enabled: hasAnyFilter,
  })

  const handleFilterChange = useCallback(
    (name: keyof SearchFilters, value: string) => {
      const next = new URLSearchParams(searchParams)
      if (name === 'page') {
        next.set('page', String(value))
      } else {
        if (String(value)) next.set(name, String(value))
        else next.delete(name)
        next.set('page', '1')
      }
      setSearchParams(next)
    },
    [searchParams, setSearchParams],
  )

  const handleReset = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return {
    error: searchQuery.error
      ? getErrorMessage(searchQuery.error, 'שגיאה בטעינת תוצאות חיפוש')
      : null,
    filters,
    hasAnyFilter,
    handleFilterChange,
    handleReset,
    loading: hasAnyFilter ? searchQuery.isPending : false,
    results: searchQuery.data?.results ?? [],
    documents: searchQuery.data?.documents ?? [],
    total: searchQuery.data?.total ?? 0,
  }
}
