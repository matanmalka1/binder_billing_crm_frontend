import { annualReportsApi, annualReportsQK } from '../api'
import type { AnnualReportDetail } from '../types'
import { useDetailQuery } from '../../../hooks/useDetailQuery'
import { useReportMutations } from './useReportMutations'
import { useReportSchedules } from './useReportSchedules'

export const useReportDetail = (reportId: number | null, onDeleted?: () => void) => {
  const reportQuery = useDetailQuery<AnnualReportDetail>(
    annualReportsQK.detail(reportId ?? 0),
    () => annualReportsApi.getReport(reportId as number) as Promise<AnnualReportDetail>,
    reportId,
    { retry: false },
  )

  const schedules = useReportSchedules(reportId)
  const mutations = useReportMutations(reportId, onDeleted)

  return {
    report: reportQuery.data ?? null,
    isLoading: reportQuery.isPending,
    error: reportQuery.error ? 'שגיאה בטעינת דוח' : null,
    transition: mutations.transition,
    isTransitioning: mutations.isTransitioning,
    completeSchedule: schedules.completeSchedule,
    addSchedule: schedules.addSchedule,
    isCompletingSchedule: schedules.isCompletingSchedule,
    isAddingSchedule: schedules.isAddingSchedule,
    updateDetail: mutations.updateDetail,
    isUpdating: mutations.isUpdating,
    deleteReport: mutations.deleteReport,
    isDeleting: mutations.isDeleting,
  }
}
