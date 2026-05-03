import { useQuery } from '@tanstack/react-query'
import { annualReportSeasonApi, annualReportsQK } from '../api'
import { getErrorMessage } from '../../../utils/utils'

export const useSeasonDashboard = (taxYear?: number) => {
  const summaryQuery = useQuery({
    queryKey: taxYear
      ? annualReportsQK.seasonSummary(taxYear)
      : annualReportsQK.activeSeasonSummary,
    queryFn: () =>
      taxYear
        ? annualReportSeasonApi.getSeasonSummary(taxYear)
        : annualReportSeasonApi.getActiveSeasonSummary(),
  })

  const reportsQuery = useQuery({
    queryKey: taxYear ? annualReportsQK.seasonList(taxYear) : annualReportsQK.activeSeasonList,
    queryFn: () =>
      taxYear
        ? annualReportSeasonApi.listSeasonReports(taxYear, { page: 1, page_size: 200 })
        : annualReportSeasonApi.listActiveSeasonReports({ page: 1, page_size: 200 }),
  })

  const overdueQuery = useQuery({
    enabled: Boolean(summaryQuery.data?.tax_year),
    queryKey: annualReportsQK.overdue(summaryQuery.data?.tax_year ?? 0),
    queryFn: () => annualReportSeasonApi.getOverdue(summaryQuery.data?.tax_year),
  })

  return {
    summary: summaryQuery.data ?? null,
    reports: reportsQuery.data?.items ?? [],
    overdue: overdueQuery.data ?? [],
    isLoading: summaryQuery.isPending || reportsQuery.isPending,
    error: summaryQuery.error
      ? getErrorMessage(summaryQuery.error, 'שגיאה בטעינת סיכום עונה')
      : reportsQuery.error
        ? getErrorMessage(reportsQuery.error, 'שגיאה בטעינת דוחות')
        : null,
  }
}
