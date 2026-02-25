import {
  AlertCircle,
  Bell,
  Receipt,
  FolderInput,
  FolderOutput,
  CreditCard,
} from "lucide-react";
import React from "react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";

export const getEventTypeLabel = (eventType: string): string => {
  const labels: Record<string, string> = {
    binder_received: "קליטת קלסר",
    binder_returned: "החזרת קלסר",
    invoice_created: "יצירת חשבונית",
    charge_created: "יצירת חיוב",
    notification: "התראה",
    notification_sent: "התראה נשלחה",
  };
  return labels[eventType] ?? "אירוע";
};

export const getEventIcon = (eventType: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    binder_received: <FolderInput className="h-3.5 w-3.5" />,
    binder_returned: <FolderOutput className="h-3.5 w-3.5" />,
    invoice_created: <Receipt className="h-3.5 w-3.5" />,
    charge_created: <CreditCard className="h-3.5 w-3.5" />,
    notification: <Bell className="h-3.5 w-3.5" />,
    notification_sent: <Bell className="h-3.5 w-3.5" />,
  };
  return icons[eventType] ?? <AlertCircle className="h-3.5 w-3.5" />;
};

export interface EventColorConfig {
  dotBg: string;
  dotBorder: string;
  cardBorder: string;
  cardTint: string;
  badgeBg: string;
  badgeText: string;
  chipActiveBg: string;
  chipActiveText: string;
  chipActiveBorder: string;
  iconColor: string;
}

const EVENT_COLORS: Record<string, EventColorConfig> = {
  binder_received: {
    dotBg: "bg-blue-500",
    dotBorder: "border-blue-300",
    cardBorder: "border-r-blue-400",
    cardTint: "from-blue-50/60",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    chipActiveBg: "bg-blue-100",
    chipActiveText: "text-blue-800",
    chipActiveBorder: "border-blue-300",
    iconColor: "text-blue-600",
  },
  binder_returned: {
    dotBg: "bg-emerald-500",
    dotBorder: "border-emerald-300",
    cardBorder: "border-r-emerald-400",
    cardTint: "from-emerald-50/60",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    chipActiveBg: "bg-emerald-100",
    chipActiveText: "text-emerald-800",
    chipActiveBorder: "border-emerald-300",
    iconColor: "text-emerald-600",
  },
  invoice_created: {
    dotBg: "bg-violet-500",
    dotBorder: "border-violet-300",
    cardBorder: "border-r-violet-400",
    cardTint: "from-violet-50/60",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-700",
    chipActiveBg: "bg-violet-100",
    chipActiveText: "text-violet-800",
    chipActiveBorder: "border-violet-300",
    iconColor: "text-violet-600",
  },
  charge_created: {
    dotBg: "bg-amber-500",
    dotBorder: "border-amber-300",
    cardBorder: "border-r-amber-400",
    cardTint: "from-amber-50/60",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    chipActiveBg: "bg-amber-100",
    chipActiveText: "text-amber-800",
    chipActiveBorder: "border-amber-300",
    iconColor: "text-amber-600",
  },
  notification: {
    dotBg: "bg-rose-500",
    dotBorder: "border-rose-300",
    cardBorder: "border-r-rose-400",
    cardTint: "from-rose-50/60",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    chipActiveBg: "bg-rose-100",
    chipActiveText: "text-rose-800",
    chipActiveBorder: "border-rose-300",
    iconColor: "text-rose-600",
  },
};

EVENT_COLORS.notification_sent = EVENT_COLORS.notification;

const DEFAULT_EVENT_COLOR: EventColorConfig = {
  dotBg: "bg-gray-400",
  dotBorder: "border-gray-300",
  cardBorder: "border-r-gray-300",
  cardTint: "from-gray-50/40",
  badgeBg: "bg-gray-100",
  badgeText: "text-gray-600",
  chipActiveBg: "bg-gray-100",
  chipActiveText: "text-gray-700",
  chipActiveBorder: "border-gray-300",
  iconColor: "text-gray-500",
};

export const getEventColor = (eventType: string): EventColorConfig =>
  EVENT_COLORS[eventType] ?? DEFAULT_EVENT_COLOR;

export const formatTimestamp = (timestamp: string): string =>
  format(parseISO(timestamp), "HH:mm", { locale: he });

export const formatDateHeading = (timestamp: string): string =>
  format(parseISO(timestamp), "EEEE, d MMMM yyyy", { locale: he });