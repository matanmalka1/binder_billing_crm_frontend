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
