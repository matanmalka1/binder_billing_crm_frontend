export type ReminderType =
  | "tax_deadline_approaching"
  | "binder_idle"
  | "unpaid_charge"
  | "custom";

export type ReminderStatus = "pending" | "sent" | "canceled";

export interface Reminder {
  id: number;
  client_id: number;
  client_name: string | null;
  reminder_type: ReminderType;
  status: ReminderStatus;
  target_date: string;
  days_before: number;
  send_on: string;
  message: string;
  created_at: string;
  sent_at: string | null;
  canceled_at: string | null;
  binder_id: number | null;
  charge_id: number | null;
  tax_deadline_id: number | null;
}

type BaseCreateReminderRequest = {
  client_id: number;
  target_date: string;
  days_before: number;
};

export type CreateReminderRequest =
  | (BaseCreateReminderRequest & {
      reminder_type: "tax_deadline_approaching";
      tax_deadline_id: number;
      message?: string;
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
      message: string;
      binder_id?: never;
      charge_id?: never;
      tax_deadline_id?: never;
    });

export interface RemindersListResponse {
  items: Reminder[];
  page: number;
  page_size: number;
  total: number;
}
