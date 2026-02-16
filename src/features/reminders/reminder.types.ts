export interface Reminder {
  id: number;
  client_id: number;
  reminder_type:
    | "TAX_DEADLINE_APPROACHING"
    | "BINDER_IDLE"
    | "UNPAID_CHARGE"
    | "CUSTOM";
  target_date: string;
  days_before: number;
  send_on: string;
  message: string;
  status: "PENDING" | "SENT" | "CANCELED";
  created_at: string;
  sent_at?: string | null;
  canceled_at?: string | null;
  binder_id?: number | null;
  charge_id?: number | null;
  tax_deadline_id?: number | null;
}

export interface CreateReminderRequest {
  client_id: number;
  reminder_type: Reminder["reminder_type"];
  target_date: string;
  days_before: number;
  message: string;
  binder_id?: number;
  charge_id?: number;
  tax_deadline_id?: number;
}

export const reminderTypeLabels: Record<string, string> = {
  TAX_DEADLINE_APPROACHING: "מועד מס מתקרב",
  BINDER_IDLE: "תיק לא פעיל",
  UNPAID_CHARGE: "חשבונית שלא שולמה",
  CUSTOM: "התאמה אישית",
};

export const statusLabels: Record<string, string> = {
  PENDING: "ממתין",
  SENT: "נשלח",
  CANCELED: "בוטל",
};
