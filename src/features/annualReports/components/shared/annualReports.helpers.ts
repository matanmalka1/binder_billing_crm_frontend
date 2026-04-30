import type { AnnualReportFull } from '../../api'
import { STATUS_LABELS } from '../../api'
import type { TimelineEventStatus } from '../statusTransition/TimelineEvent'
import {
  formatAnnualReportDate,
  REQUIRED_DOCUMENT_TYPES,
  WARNING_DEADLINE_DAYS,
} from './annualReports.constants'

export interface AnnualReportTimelineEvent {
  title: string
  description: string
  date: string
  status: TimelineEventStatus
  sortTime: number
}

export const getAnnualReportName = (report: AnnualReportFull): string =>
  report.client_name ?? `דוח #${report.id}`

export const getClientReportName = (report: AnnualReportFull): string =>
  report.client_name ?? `לקוח #${report.client_record_id}`

export const getDaysOverdue = (deadline: string | null): number | null => {
  if (!deadline) return null
  const diff = Math.floor((Date.now() - new Date(deadline).getTime()) / 86_400_000)
  return diff > 0 ? diff : null
}

export const getDeadlineStatus = (report: AnnualReportFull): TimelineEventStatus => {
  if (!report.filing_deadline) return 'pending'
  if (report.submitted_at) return 'done'
  const daysUntilDeadline = (new Date(report.filing_deadline).getTime() - Date.now()) / 86_400_000
  if (daysUntilDeadline < 0) return 'overdue'
  return daysUntilDeadline < WARNING_DEADLINE_DAYS ? 'warning' : 'pending'
}

export const getMissingDocumentTypes = (
  uploadedTypes: Set<string>,
  signalTypes: string[] | undefined,
): string[] =>
  signalTypes?.length
    ? signalTypes
    : REQUIRED_DOCUMENT_TYPES.filter((type) => !uploadedTypes.has(type))

const getReportStatusDescription = (report: AnnualReportFull): string =>
  `סטטוס: ${STATUS_LABELS[report.status]}`

export const buildTimelineEvents = (reports: AnnualReportFull[]): AnnualReportTimelineEvent[] =>
  reports
    .flatMap((report) => {
      const name = getAnnualReportName(report)
      const events: AnnualReportTimelineEvent[] = []

      if (report.submitted_at) {
        const submittedTime = new Date(report.submitted_at).getTime()
        const onTime =
          report.filing_deadline && submittedTime <= new Date(report.filing_deadline).getTime()
        events.push({
          title: `הוגש — ${name} (${report.tax_year})`,
          description: getReportStatusDescription(report),
          date: formatAnnualReportDate(report.submitted_at),
          status: onTime ? 'done' : 'warning',
          sortTime: submittedTime,
        })
      }

      if (report.filing_deadline && !report.submitted_at) {
        const deadlineTime = new Date(report.filing_deadline).getTime()
        events.push({
          title: `מועד הגשה — ${name} (${report.tax_year})`,
          description: getReportStatusDescription(report),
          date: formatAnnualReportDate(report.filing_deadline),
          status: deadlineTime < Date.now() ? 'overdue' : 'pending',
          sortTime: deadlineTime,
        })
      }

      return events
    })
    .sort((a, b) => b.sortTime - a.sortTime)

export const getFilingStats = (reports: AnnualReportFull[]) => {
  const total = reports.length
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0)
  const submittedOnTime = reports.filter(
    (report) =>
      report.submitted_at &&
      report.filing_deadline &&
      new Date(report.submitted_at) <= new Date(report.filing_deadline),
  ).length
  const pending = reports.filter((report) => !report.submitted_at).length
  const amended = reports.filter((report) => report.status === 'amended').length

  return [
    {
      label: 'הוגשו בזמן',
      count: submittedOnTime,
      pct: pct(submittedOnTime),
      color: 'bg-positive-500',
    },
    { label: 'ממתין להגשה', count: pending, pct: pct(pending), color: 'bg-info-400' },
    { label: 'עם תיקונים', count: amended, pct: pct(amended), color: 'bg-warning-400' },
  ]
}
