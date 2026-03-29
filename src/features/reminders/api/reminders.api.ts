import { api } from "@/api/client";
import { REMINDER_ENDPOINTS } from "./endpoints";
import type { Reminder, CreateReminderRequest, RemindersListResponse, ReminderStatus } from "./contracts";

export const remindersApi = {
  list: async (params?: {
    page?: number;
    page_size?: number;
    status?: ReminderStatus;
    business_id?: number;
  }): Promise<RemindersListResponse> => {
    const response = await api.get<RemindersListResponse>(REMINDER_ENDPOINTS.reminders, { params });
    return response.data;
  },

  get: async (id: number): Promise<Reminder> => {
    const response = await api.get<Reminder>(REMINDER_ENDPOINTS.reminderById(id));
    return response.data;
  },

  create: async (data: CreateReminderRequest): Promise<Reminder> => {
    const response = await api.post<Reminder>(REMINDER_ENDPOINTS.reminders, data);
    return response.data;
  },

  cancel: async (id: number): Promise<Reminder> => {
    const response = await api.post<Reminder>(REMINDER_ENDPOINTS.reminderCancel(id));
    return response.data;
  },

  markSent: async (id: number): Promise<Reminder> => {
    const response = await api.post<Reminder>(REMINDER_ENDPOINTS.reminderMarkSent(id));
    return response.data;
  },
};
