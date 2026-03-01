import { ENDPOINTS } from "./endpoints";
import { api } from "./client";

// Enum values are lowercase strings as returned by the backend
// (Python enum .value, e.g. ReminderType.TAX_DEADLINE_APPROACHING.value === "tax_deadline_approaching")
export type ReminderType =
  | "tax_deadline_approaching"
  | "binder_idle"
  | "unpaid_charge"
  | "custom";

export type ReminderStatus = "pending" | "sent" | "canceled";

// Matches app/schemas/reminders.py → ReminderResponse
export interface Reminder {
  id: number;
  client_id: number;
  client_name: string | null;
  reminder_type: ReminderType;
  status: ReminderStatus;
  target_date: string; // ISO date string (YYYY-MM-DD)
  days_before: number;
  send_on: string; // ISO date string (YYYY-MM-DD) — calculated: target_date - days_before
  message: string; // Always present in response (non-optional)
  created_at: string; // ISO datetime string
  sent_at: string | null;
  canceled_at: string | null;
  binder_id: number | null;
  charge_id: number | null;
  tax_deadline_id: number | null;
}


// Discriminated union matches backend validation so callers supply the right FK/message
type BaseCreateReminderRequest = {
  client_id: number;
  target_date: string; // ISO date string (YYYY-MM-DD)
  days_before: number; // >= 0
};

export type CreateReminderRequest =
  | (BaseCreateReminderRequest & {
      reminder_type: "tax_deadline_approaching";
      tax_deadline_id: number;
      message?: string; // backend supplies default if omitted
      binder_id?: never;
      charge_id?: never;
    })
  | (BaseCreateReminderRequest & {
      reminder_type: "binder_idle";
      binder_id: number;
      message?: string;
      tax_deadline_id?: never;
      charge_id?: never;
    })
  | (BaseCreateReminderRequest & {
      reminder_type: "unpaid_charge";
      charge_id: number;
      message?: string;
      binder_id?: never;
      tax_deadline_id?: never;
    })
  | (BaseCreateReminderRequest & {
      reminder_type: "custom";
      message: string; // required for custom
      binder_id?: never;
      charge_id?: never;
      tax_deadline_id?: never;
    });

// Matches app/schemas/reminders.py → ReminderListResponse
export interface RemindersListResponse {
  items: Reminder[];
  page: number;
  page_size: number;
  total: number;
}


export const remindersApi = {

  list: async (params?: {
    page?: number;
    page_size?: number;
    status?: ReminderStatus;
    client_id?: number;
  }): Promise<RemindersListResponse> => {
    const response = await api.get<RemindersListResponse>(ENDPOINTS.reminders, {
      params,
    });
    // Backend default: pending reminders with send_on <= today; with `status`, returns all matching reminders.
    return response.data;
  },

  /**
   * Get a single reminder by ID.
   */
  get: async (id: number): Promise<Reminder> => {
    const response = await api.get<Reminder>(ENDPOINTS.reminderById(id));
    return response.data;
  },


  create: async (data: CreateReminderRequest): Promise<Reminder> => {
    const response = await api.post<Reminder>(ENDPOINTS.reminders, data);
    return response.data;
  },

  cancel: async (id: number): Promise<Reminder> => {
    const response = await api.post<Reminder>(ENDPOINTS.reminderCancel(id));
    return response.data;
  },

  markSent: async (id: number): Promise<Reminder> => {
    const response = await api.post<Reminder>(ENDPOINTS.reminderMarkSent(id));
    return response.data;
  },
};
