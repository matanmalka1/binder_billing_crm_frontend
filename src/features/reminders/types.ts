// Re-export backend-aligned types from the API client to avoid divergence
export {
  reminderStatusLabels as statusLabels,
  reminderStatusVariants,
  reminderTypeLabels,
  reminderTypeOptions,
} from './api'
export type { Reminder, ReminderType, ReminderStatus, CreateReminderRequest, RemindersListResponse } from './api'

export type { CreateReminderFormValues } from './schemas'
