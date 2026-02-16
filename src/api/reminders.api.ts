import { ENDPOINTS } from "./endpoints";
import { api } from "./client";

// Reminder type definition matching backend model
export interface Reminder {
  id: number;
  client_id: number;
  reminder_type:
    | "TAX_DEADLINE_APPROACHING"
    | "BINDER_IDLE"
    | "UNPAID_CHARGE"
    | "CUSTOM";
  target_date: string; // ISO date string
  days_before: number;
  send_on: string; // ISO date string (calculated: target_date - days_before)
  message: string;
  status: "PENDING" | "SENT" | "CANCELED";
  created_at: string; // ISO datetime string
  sent_at?: string | null; // ISO datetime string
  canceled_at?: string | null; // ISO datetime string
  binder_id?: number | null;
  charge_id?: number | null;
  tax_deadline_id?: number | null;
}

// Create reminder request interface
export interface CreateReminderRequest {
  client_id: number;
  reminder_type: Reminder["reminder_type"];
  target_date: string; // ISO date string (YYYY-MM-DD)
  days_before: number;
  message: string;
  binder_id?: number;
  charge_id?: number;
  tax_deadline_id?: number;
}

// List reminders response (paginated)
export interface RemindersListResponse {
  items: Reminder[];
  page?: number;
  page_size?: number;
  total?: number;
}

/**
 * Reminders API Client
 *
 * NOTE: Backend endpoints need to be implemented
 * Required backend endpoints:
 * - GET /api/v1/reminders - List reminders
 * - POST /api/v1/reminders - Create reminder
 * - POST /api/v1/reminders/{id}/cancel - Cancel reminder
 * - GET /api/v1/reminders/{id} - Get single reminder (optional)
 */
export const remindersApi = {
  /**
   * List all reminders (with optional pagination)
   */
  list: async (params?: {
    page?: number;
    page_size?: number;
    status?: "PENDING" | "SENT" | "CANCELED";
  }): Promise<Reminder[]> => {
    try {
      const response = await api.get<RemindersListResponse>(
        ENDPOINTS.reminders,
        {
          params,
        },
      );

      // Handle both paginated and non-paginated responses
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching reminders:", error);
      throw error;
    }
  },

  /**
   * Get a single reminder by ID
   */
  get: async (id: number): Promise<Reminder> => {
    try {
      const response = await api.get<Reminder>(`${ENDPOINTS.reminders}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reminder ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new reminder
   */
  create: async (data: CreateReminderRequest): Promise<Reminder> => {
    try {
      const response = await api.post<Reminder>(ENDPOINTS.reminders, data);
      return response.data;
    } catch (error) {
      console.error("Error creating reminder:", error);
      throw error;
    }
  },

  /**
   * Cancel a pending reminder
   * Only PENDING reminders can be canceled
   */
  cancel: async (id: number): Promise<void> => {
    try {
      await api.post(`${ENDPOINTS.reminders}/${id}/cancel`);
    } catch (error) {
      console.error(`Error canceling reminder ${id}:`, error);
      throw error;
    }
  },

  /**
   * Mark a reminder as sent (typically used by backend job)
   * This is usually not called from frontend
   */
  markSent: async (id: number): Promise<Reminder> => {
    try {
      const response = await api.post<Reminder>(
        `${ENDPOINTS.reminders}/${id}/mark-sent`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error marking reminder ${id} as sent:`, error);
      throw error;
    }
  },
};
