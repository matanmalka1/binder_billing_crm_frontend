import { api } from "@/api/client";
import { NOTIFICATION_ENDPOINTS } from "./endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  NotificationItem,
  NotificationListResponse,
  UnreadCountResponse,
  MarkReadResponse,
  ListNotificationsParams,
  SendNotificationPayload,
  SendNotificationResponse,
} from "./contracts";

const normalizeNotifications = (
  data: NotificationItem[] | NotificationListResponse,
): NotificationItem[] => {
  if (Array.isArray(data)) return data;
  return Array.isArray(data.items) ? data.items : [];
};

export const notificationsApi = {
  list: async (params?: ListNotificationsParams): Promise<NotificationItem[]> => {
    const response = await api.get<NotificationItem[] | NotificationListResponse>(
      NOTIFICATION_ENDPOINTS.notifications,
      params ? { params: toQueryParams(params) } : undefined,
    );
    return normalizeNotifications(response.data);
  },

  getUnreadCount: async (clientId?: number): Promise<UnreadCountResponse> => {
    const response = await api.get<UnreadCountResponse>(
      NOTIFICATION_ENDPOINTS.notificationsUnreadCount,
      clientId != null ? { params: toQueryParams({ client_id: clientId }) } : undefined,
    );
    return response.data;
  },

  markRead: async (notificationIds: number[]): Promise<MarkReadResponse> => {
    const response = await api.post<MarkReadResponse>(
      NOTIFICATION_ENDPOINTS.notificationsMarkRead,
      { notification_ids: notificationIds },
    );
    return response.data;
  },

  markAllRead: async (clientId?: number): Promise<MarkReadResponse> => {
    const response = await api.post<MarkReadResponse>(
      NOTIFICATION_ENDPOINTS.notificationsMarkAllRead,
      null,
      clientId != null ? { params: toQueryParams({ client_id: clientId }) } : undefined,
    );
    return response.data;
  },

  send: async (payload: SendNotificationPayload): Promise<SendNotificationResponse> => {
    const businessId = payload.business_id ?? payload.client_id;
    const response = await api.post<SendNotificationResponse>(
      NOTIFICATION_ENDPOINTS.notificationsSend,
      {
        business_id: businessId,
        channel: payload.channel.toLowerCase() as "whatsapp" | "email",
        message: payload.message,
        severity: payload.severity,
      },
    );
    return response.data;
  },
};
