import type { NotificationSeverity } from "../../../api/notifications.api";
import { cn } from "../../../utils/utils";
import type { SeverityBadgeProps } from "../types";

const SEVERITY_LABELS: Record<NotificationSeverity, string> = {
  info: "מידע",
  warning: "אזהרה",
  urgent: "דחוף",
  critical: "קריטי",
};

const SEVERITY_STYLES: Record<NotificationSeverity, string> = {
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
  urgent: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
      SEVERITY_STYLES[severity],
    )}
  >
    {SEVERITY_LABELS[severity]}
  </span>
);
SeverityBadge.displayName = "SeverityBadge";
