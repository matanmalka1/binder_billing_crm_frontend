import { useMutation, useQueryClient } from '@tanstack/react-query'
import { annualReportsApi, annualReportsQK, type AnnualReportScheduleKey } from '../api'
import { showErrorToast } from '../../../utils/utils'
import { toast } from '../../../utils/toast'

export const useReportSchedules = (reportId: number | null) => {
  const queryClient = useQueryClient()
  const enabled = reportId !== null && reportId > 0
  const queryKey = annualReportsQK.detail(reportId ?? 0)
  const qk = enabled ? queryKey : null

  const completeScheduleMutation = useMutation({
    mutationFn: (schedule: AnnualReportScheduleKey) =>
      annualReportsApi.completeSchedule(reportId as number, schedule),
    onSuccess: () => {
      toast.success('נספח סומן כהושלם')
      if (qk) void queryClient.invalidateQueries({ queryKey: qk })
    },
    onError: (err) => showErrorToast(err, 'שגיאה בעדכון נספח'),
  })

  const addScheduleMutation = useMutation({
    mutationFn: ({ schedule, notes }: { schedule: AnnualReportScheduleKey; notes?: string }) =>
      annualReportsApi.addSchedule(reportId as number, { schedule, notes }),
    onSuccess: () => {
      toast.success('נספח נוסף בהצלחה')
      if (qk) void queryClient.invalidateQueries({ queryKey: qk })
    },
    onError: (err) => showErrorToast(err, 'שגיאה בהוספת נספח'),
  })

  return {
    completeSchedule: (schedule: AnnualReportScheduleKey) =>
      completeScheduleMutation.mutate(schedule),
    addSchedule: (schedule: AnnualReportScheduleKey, notes?: string) =>
      addScheduleMutation.mutate({ schedule, notes }),
    isCompletingSchedule: completeScheduleMutation.isPending,
    isAddingSchedule: addScheduleMutation.isPending,
  }
}
