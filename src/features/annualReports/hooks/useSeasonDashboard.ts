import { useQuery } from '@tanstack/react-query'
import { annualReportSeasonApi, annualReportsQK } from '../api'
import { getErrorMessage } from '../../../utils/utils'

export const useSeasonDashboard = (taxYear: number) => {
  const summaryQuery = useQuery({
    queryKey: annualReportsQK.seasonSummary(taxYear),
    queryFn: () => annualReportSeasonApi.getSeasonSummary(taxYear),
  })

  const reportsQuery = useQuery({
    queryKey: annualReportsQK.seasonList(taxYear),
    queryFn: () => annualReportSeasonApi.listSeasonReports(taxYear, { page: 1, page_size: 200 }),
  })

  const overdueQuery = useQuery({
    queryKey: annualReportsQK.overdue(taxYear),
    queryFn: () => annualReportSeasonApi.getOverdue(taxYear),
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
