import { api } from '@/api/client'
import { REMINDER_ENDPOINTS } from './endpoints'
import {
  createReminderRequestSchema,
  type Reminder,
  type CreateReminderRequest,
  type RemindersListResponse,
  type ReminderStatus,
  type ReminderDueFilter,
} from './contracts'

export const remindersApi = {
  list: async (params?: {
    page?: number
    page_size?: number
    status?: ReminderStatus
    due?: ReminderDueFilter
    client_record_id?: number
    created_before?: string
  }): Promise<RemindersListResponse> => {
    const response = await api.get<RemindersListResponse>(REMINDER_ENDPOINTS.reminders, { params })
    return response.data
  },

  get: async (id: number): Promise<Reminder> => {
    const response = await api.get<Reminder>(REMINDER_ENDPOINTS.reminderById(id))
    return response.data
  },

  create: async (data: CreateReminderRequest): Promise<Reminder> => {
    const response = await api.post<Reminder>(REMINDER_ENDPOINTS.reminders, createReminderRequestSchema.parse(data))
    return response.data
  },

  cancel: async (id: number): Promise<Reminder> => {
    const response = await api.post<Reminder>(REMINDER_ENDPOINTS.reminderCancel(id))
    return response.data
  },

  markSent: async (id: number): Promise<Reminder> => {
    const response = await api.post<Reminder>(REMINDER_ENDPOINTS.reminderMarkSent(id))
    return response.data
  },
}
