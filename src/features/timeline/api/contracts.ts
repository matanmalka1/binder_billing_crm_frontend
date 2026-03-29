import type { BackendAction } from "@/lib/actions/types";

export type TimelineBinderStatus =
  | "none"
  | "in_office"
  | "ready_for_pickup"
  | "returned";

export type TimelineNotificationChannel = "whatsapp" | "email" | "sms";

export type TimelineNotificationTrigger =
  | "binder_received"
  | "binder_ready_for_pickup"
  | "manual_payment_reminder";

export interface TimelineEventMetadata {
  old_status?: TimelineBinderStatus | null;
  new_status?: TimelineBinderStatus | null;
  amount?: number | string | null;
  channel?: TimelineNotificationChannel | null;
  trigger?: TimelineNotificationTrigger | null;
  provider?: string | null;
  external_invoice_id?: string | number | null;
  [key: string]: unknown;
}

export interface TimelineEvent {
  event_type: string;
  timestamp: string;
  binder_id: number | null;
  charge_id: number | null;
  description: string;
  metadata?: TimelineEventMetadata | null;
  actions?: BackendAction[] | null;
  available_actions?: BackendAction[] | null;
}

export interface TimelineResponse {
  client_id: number;
  events: TimelineEvent[];
  page: number;
  page_size: number;
  total: number;
}

export interface TimelineParams {
  page?: number;
  page_size?: number;
}
