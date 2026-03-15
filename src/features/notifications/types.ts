import type { NotificationSeverity } from "../../api/notifications.api";

export interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface NotificationsTabProps {
  clientId: number;
}

export interface SeverityBadgeProps {
  severity: NotificationSeverity;
}

export interface SendNotificationModalProps {
  open: boolean;
  onClose: () => void;
  clientId?: number;
}
