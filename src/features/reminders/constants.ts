import { ALL_TYPES_OPTION } from '@/constants/filterOptions.constants'
import { reminderTypeLabels, statusLabels, type ReminderStatus, type ReminderType } from './types'

export const DEFAULT_REMINDER_STATUS_FILTER = 'pending'
export const REMINDER_DUE_READY_FILTER = 'ready'
export const REMINDER_DUE_FILTER_LABELS = {
  ready: 'ממתינות לפעולה עכשיו',
} as const
export type ReminderDueFilter = keyof typeof REMINDER_DUE_FILTER_LABELS
export const REMINDERS_PAGE_SIZE = 20
export const ACTIVE_REMINDERS_PAGE_SIZE = 500
export const LINKED_ENTITY_PAGE_SIZE = 100

export const ACTIVE_REMINDER_STATUSES: ReminderStatus[] = ['pending', 'sent']

export const DUPLICATE_REMINDER_MESSAGE = 'קיימת כבר תזכורת פעילה לאותו לקוח, סוג ותאריך יעד'

export const REMINDER_TYPE_OPTIONS = [
  ALL_TYPES_OPTION,
  ...(Object.entries(reminderTypeLabels) as [ReminderType, string][]).map(([value, label]) => ({
    value,
    label,
  })),
]

export const REMINDER_STATUS_OPTIONS = [
  { value: '', label: 'כל הסטטוסים' },
  ...(Object.entries(statusLabels) as [ReminderStatus, string][]).map(([value, label]) => ({
    value,
    label,
  })),
]

export const MESSAGE_REMINDER_TYPES: ReminderType[] = ['binder_idle']
