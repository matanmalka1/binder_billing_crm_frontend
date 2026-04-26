import type { BackendAction } from "@/lib/actions/types";

// ── Domain enums ──────────────────────────────────────────────────────────────

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

// ── Metadata ──────────────────────────────────────────────────────────────────

export interface TimelineEventMetadata {
  old_status?:         TimelineBinderStatus | null;
  new_status?:         TimelineBinderStatus | null;
  amount?:             number | string | null;
  channel?:            TimelineNotificationChannel | null;
  trigger?:            TimelineNotificationTrigger | null;
  provider?:           string | null;
  external_invoice_id?: string | number | null;
  [key: string]: unknown;
}

// ── Core event ────────────────────────────────────────────────────────────────

export interface TimelineEvent {
  event_type:  string;
  timestamp:   string;
  binder_id:   number | null;
  charge_id:   number | null;
  description: string;
  metadata?:   TimelineEventMetadata | null;
  /** Single canonical field – backend may send either name */
  actions?:    BackendAction[] | null;
  available_actions?: BackendAction[] | null;
}

// ── API contracts ─────────────────────────────────────────────────────────────

export interface TimelineResponse {
  client_record_id: number;
  events:    TimelineEvent[];
  page:      number;
  page_size: number;
  total:     number;
}

export interface TimelineParams {
  page?:      number;
  page_size?: number;
}
