import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { advancePaymentsApi, advancedPaymentsQK } from '../api'
import type { AdvancePaymentOverviewRow, AdvancePaymentStatus } from '../types'
import { PAGE_SIZE } from '../constants'

interface UseAdvancePaymentsOverviewParams {
  year: number
  month: number
  statusFilter: string
  page: number
}

export const useAdvancePaymentsOverview = ({ year, month, statusFilter, page }: UseAdvancePaymentsOverviewParams) => {
  const queryParams = useMemo(() => {
    const statuses = statusFilter ? [statusFilter as AdvancePaymentStatus] : undefined
    return {
      year,
      ...(month > 0 ? { month } : {}),
      ...(statuses ? { status: statuses } : {}),
      page,
      page_size: PAGE_SIZE,
    }
  }, [year, month, statusFilter, page])

  const { data, isLoading, error } = useQuery({
    queryKey: advancedPaymentsQK.overview(queryParams),
    queryFn: () => advancePaymentsApi.overview(queryParams),
  })

  const rows: AdvancePaymentOverviewRow[] = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const kpiData = {
    total_expected: data?.total_expected ?? null,
    total_paid: data?.total_paid ?? null,
    collection_rate: data?.collection_rate ?? null,
  }

  return {
    rows,
    total,
    totalPages,
    isLoading,
    error: error ?? null,
    kpiData,
  }
}
