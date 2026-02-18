// Re-export backend-aligned types from the API client to avoid divergence
export type {
  Reminder,
  ReminderType,
  ReminderStatus,
  CreateReminderRequest,
  RemindersListResponse,
} from "../../api/reminders.api";

export const reminderTypeLabels: Record<string, string> = {
  tax_deadline_approaching: "מועד מס מתקרב",
  binder_idle: "תיק לא פעיל",
  unpaid_charge: "חשבונית שלא שולמה",
  custom: "התאמה אישית",
};

export const statusLabels: Record<string, string> = {
  pending: "ממתין",
  sent: "נשלח",
  canceled: "בוטל",
};

export interface CreateReminderFormValues {
  reminder_type: "tax_deadline_approaching" | "binder_idle" | "unpaid_charge" | "custom";
  client_id: string;
  target_date: string;
  days_before: number;
  tax_deadline_id?: string;
  binder_id?: string;
  charge_id?: string;
  message: string;
}
