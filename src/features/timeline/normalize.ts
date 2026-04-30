import { endOfDay, isAfter, isBefore, parseISO, startOfDay } from 'date-fns'
import { mapActions } from '@/lib/actions/mapActions'
import type { ActionCommand } from '@/lib/actions/types'
import type { TimelineEvent, TimelineEventMetadata } from './api'
import { getTimelineStatusLabel, getTimelineTriggerLabel } from './labels'
import { getEventTypeLabel } from './utils'

export type TimelineFilterKey =
  | 'all'
  | 'past'
  | 'future'
  | 'finance'
  | 'binders'
  | 'documents'
  | 'tax'
  | 'communication'

export interface NormalizedTimelineEvent extends TimelineEvent {
  title: string
  secondary: string | null
  displayTimestamp: string
  isDateOnly: boolean
  filterKeys: TimelineFilterKey[]
  importance: 'strong' | 'quiet'
  relatedEntity: string | null
  actionsList: ActionCommand[]
}

const DEADLINE_TYPE_LABELS: Record<string, string> = {
  advance_payment: 'מקדמה',
  advance: 'מקדמה',
  vat: 'מע״מ',
  national_insurance: 'ביטוח לאומי',
  annual_report: 'דוח שנתי',
  other: 'אחר',
}

const FILTER_BY_EVENT_TYPE: Record<string, TimelineFilterKey[]> = {
  charge_created: ['past', 'finance'],
  charge_issued: ['past', 'finance'],
  charge_paid: ['past', 'finance'],
  invoice_created: ['past', 'finance'],
  invoice_attached: ['past', 'finance'],
  binder_received: ['past', 'binders'],
  binder_returned: ['past', 'binders'],
  binder_status_change: ['past', 'binders'],
  document_uploaded: ['past', 'documents'],
  tax_deadline_due: ['tax'],
  annual_report_status_changed: ['past', 'tax'],
  reminder_created: ['past', 'communication'],
  notification: ['past', 'communication'],
  notification_sent: ['past', 'communication'],
  signature_request_created: ['past', 'communication', 'documents'],
}

const STRONG_EVENTS = new Set([
  'charge_created',
  'charge_issued',
  'charge_paid',
  'annual_report_status_changed',
  'signature_request_created',
  'binder_status_change',
  'document_uploaded',
])

const getMetadataString = (
  metadata: TimelineEventMetadata | null | undefined,
  keys: string[],
): string | null => {
  for (const key of keys) {
    const value = metadata?.[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return null
}

export const getDeadlineTypeLabel = (
  metadata: TimelineEventMetadata | null | undefined,
): string => {
  const type = getMetadataString(metadata, ['deadline_type', 'type'])
  return type ? (DEADLINE_TYPE_LABELS[type] ?? 'אחר') : 'אחר'
}

const getDeadlineDate = (event: TimelineEvent): string => {
  const value = getMetadataString(event.metadata, ['deadline_date', 'due_date', 'date'])
  return value ?? event.timestamp
}

const isFutureDeadline = (event: TimelineEvent, now: Date): boolean =>
  event.event_type === 'tax_deadline_due' &&
  isAfter(endOfDay(parseISO(getDeadlineDate(event))), now)

const isPastEvent = (event: TimelineEvent, now: Date): boolean =>
  event.event_type !== 'tax_deadline_due' ||
  isBefore(startOfDay(parseISO(getDeadlineDate(event))), startOfDay(now))

const shouldHideEvent = (event: TimelineEvent): boolean =>
  event.event_type === 'binder_status_change' &&
  event.metadata?.old_status != null &&
  event.metadata?.new_status != null &&
  event.metadata.old_status === event.metadata.new_status

const getRelatedEntity = (event: TimelineEvent): string | null => {
  if (event.charge_id != null) return `חיוב #${event.charge_id}`
  if (event.binder_id != null) return `קלסר #${event.binder_id}`
  const documentName = getMetadataString(event.metadata, ['document_name', 'filename'])
  if (documentName) return `מסמך ${documentName}`
  const reportYear = event.metadata?.report_year
  if (reportYear != null) return `דוח שנתי ${String(reportYear)}`
  return null
}

const buildTitle = (event: TimelineEvent, groupedCount?: number): string => {
  if (event.event_type === 'tax_deadline_due') return getDeadlineTypeLabel(event.metadata)
  if (event.event_type === 'reminder_created' && groupedCount && groupedCount > 1) {
    return `נוצרו ${groupedCount} תזכורות למועדי מס`
  }
  return getEventTypeLabel(event.event_type)
}

const buildSecondary = (event: TimelineEvent, groupedCount?: number): string | null => {
  if (event.event_type === 'binder_status_change') {
    const oldLabel = getTimelineStatusLabel(String(event.metadata?.old_status ?? ''))
    const newLabel = getTimelineStatusLabel(String(event.metadata?.new_status ?? ''))
    return `${oldLabel} ← ${newLabel}`
  }
  if (event.event_type === 'tax_deadline_due') {
    return event.description && event.description !== 'מועד מס' ? event.description : null
  }
  if (event.event_type === 'reminder_created' && groupedCount && groupedCount > 1) {
    const trigger = event.metadata?.trigger
      ? getTimelineTriggerLabel(String(event.metadata.trigger))
      : null
    return trigger ? `סוג תזכורת: ${trigger}` : null
  }
  return event.description || null
}

const normalizeEvent = (
  event: TimelineEvent,
  now: Date,
  groupedCount?: number,
): NormalizedTimelineEvent => {
  const isDeadline = event.event_type === 'tax_deadline_due'
  const future = isDeadline && isFutureDeadline(event, now)
  const filterKeys = FILTER_BY_EVENT_TYPE[event.event_type] ?? ['past']

  return {
    ...event,
    title: buildTitle(event, groupedCount),
    secondary: buildSecondary(event, groupedCount),
    displayTimestamp: isDeadline ? getDeadlineDate(event) : event.timestamp,
    isDateOnly: isDeadline,
    filterKeys: future ? ['future', 'tax'] : filterKeys,
    importance: STRONG_EVENTS.has(event.event_type) ? 'strong' : 'quiet',
    relatedEntity: getRelatedEntity(event),
    actionsList: mapActions(event.actions ?? event.available_actions),
  }
}

const reminderGroupKey = (event: TimelineEvent): string =>
  [
    event.event_type,
    event.timestamp.slice(0, 10),
    event.description,
    event.metadata?.trigger ?? '',
  ].join('|')

const groupReminders = (
  events: TimelineEvent[],
): Array<TimelineEvent & { groupedCount?: number }> => {
  const grouped = new Map<string, TimelineEvent & { groupedCount?: number }>()
  const output: Array<TimelineEvent & { groupedCount?: number }> = []

  for (const event of events) {
    if (event.event_type !== 'reminder_created') {
      output.push(event)
      continue
    }
    const key = reminderGroupKey(event)
    const existing = grouped.get(key)
    if (existing) {
      existing.groupedCount = (existing.groupedCount ?? 1) + 1
    } else {
      const next = { ...event, groupedCount: 1 }
      grouped.set(key, next)
      output.push(next)
    }
  }

  return output
}

export const normalizeTimelineEvents = (events: TimelineEvent[], now = new Date()) => {
  const visible = events.filter((event) => !shouldHideEvent(event))
  const upcomingDeadlines = visible
    .filter((event) => isFutureDeadline(event, now))
    .sort((a, b) => parseISO(getDeadlineDate(a)).getTime() - parseISO(getDeadlineDate(b)).getTime())
    .slice(0, 5)
    .map((event) => normalizeEvent(event, now))

  const historicalEvents = groupReminders(visible.filter((event) => isPastEvent(event, now)))
    .map((event) => normalizeEvent(event, now, event.groupedCount))
    .sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime())

  return { historicalEvents, upcomingDeadlines }
}
