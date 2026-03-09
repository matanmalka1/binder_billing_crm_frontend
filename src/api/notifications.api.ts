import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";

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

export const notificationsApi = {
  list: async (params?: ListNotificationsParams): Promise<NotificationItem[]> => {
    const response = await api.get<NotificationItem[]>(
      ENDPOINTS.notifications,
      params ? { params: toQueryParams(params) } : undefined,
    );
    return response.data;
  },

  getUnreadCount: async (clientId?: number): Promise<UnreadCountResponse> => {
    const response = await api.get<UnreadCountResponse>(
      ENDPOINTS.notificationsUnreadCount,
      clientId != null ? { params: toQueryParams({ client_id: clientId }) } : undefined,
    );
    return response.data;
  },

  markRead: async (notificationIds: number[]): Promise<MarkReadResponse> => {
    const response = await api.post<MarkReadResponse>(
      ENDPOINTS.notificationsMarkRead,
      { notification_ids: notificationIds },
    );
    return response.data;
  },

  markAllRead: async (clientId: number): Promise<MarkReadResponse> => {
    const response = await api.post<MarkReadResponse>(
      ENDPOINTS.notificationsMarkAllRead,
      null,
      { params: toQueryParams({ client_id: clientId }) },
    );
    return response.data;
  },
};
