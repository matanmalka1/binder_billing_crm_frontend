export type ReminderType =
  | "tax_deadline_approaching"
  | "binder_idle"
  | "unpaid_charge"
  | "custom";

export type ReminderStatus = "pending" | "sent" | "canceled";

export interface Reminder {
  id: number;
  business_id: number;
  business_name: string | null;
  reminder_type: ReminderType;
  status: ReminderStatus;
  target_date: string;
  days_before: number;
  send_on: string;
  message: string;
  binder_id: number | null;
  charge_id: number | null;
  tax_deadline_id: number | null;
  annual_report_id: number | null;
  advance_payment_id: number | null;
  created_at: string;
  created_by: number | null;
  sent_at: string | null;
  canceled_at: string | null;
  canceled_by: number | null;
}

type BaseCreateReminderRequest = {
  business_id: number;
  target_date: string;
  days_before: number;
  annual_report_id?: number | null;
  advance_payment_id?: number | null;
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
