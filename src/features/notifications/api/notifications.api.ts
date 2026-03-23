import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  NotificationItem,
  UnreadCountResponse,
  MarkReadResponse,
  ListNotificationsParams,
  SendNotificationPayload,
  SendNotificationResponse,
} from "./contracts";

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

  markAllRead: async (clientId?: number): Promise<MarkReadResponse> => {
    const response = await api.post<MarkReadResponse>(
      ENDPOINTS.notificationsMarkAllRead,
      null,
      clientId != null ? { params: toQueryParams({ client_id: clientId }) } : undefined,
    );
    return response.data;
  },

  send: async (payload: SendNotificationPayload): Promise<SendNotificationResponse> => {
    const response = await api.post<SendNotificationResponse>(
      ENDPOINTS.notificationsSend,
      payload,
    );
    return response.data;
  },
};
