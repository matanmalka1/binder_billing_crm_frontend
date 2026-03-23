export type NotificationSeverity = "info" | "warning" | "urgent" | "critical";

export interface NotificationItem {
  id: number;
  client_id: number;
  trigger: string;
  channel: string;
  status: string;
  severity: NotificationSeverity;
  content_snapshot: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkReadResponse {
  updated: number;
}

export interface ListNotificationsParams {
  client_id?: number;
  limit?: number;
}

export interface SendNotificationPayload {
  client_id: number;
  channel: "WHATSAPP" | "EMAIL";
  message: string;
  severity?: string;
}

export interface SendNotificationResponse {
  ok: boolean;
}
