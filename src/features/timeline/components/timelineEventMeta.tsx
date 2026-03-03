import {
  AlertCircle,
  ArrowLeftRight,
  Bell,
  CalendarClock,
  CheckCircle,
  FileText,
  Receipt,
  FolderInput,
  FolderOutput,
  CreditCard,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import type { EventColorConfig } from "../types";

export type { EventColorConfig };

// ── Labels & Icons ─────────────────────────────────────────────────────────────

const EVENT_LABELS: Record<string, string> = {
  binder_received: "קליטת קלסר",
  binder_returned: "החזרת קלסר",
  binder_status_change: "שינוי סטטוס קלסר",
  invoice_created: "יצירת חשבונית",
  invoice_attached: "חשבונית צורפה",
  charge_created: "יצירת חיוב",
  charge_issued: "הנפקת חיוב",
  charge_paid: "תשלום חיוב",
  notification: "התראה",
  notification_sent: "התראה נשלחה",
  tax_deadline_due: "מועד מס",
  annual_report_status_changed: "דוח שנתי",
};

export const getEventTypeLabel = (eventType: string): string =>
  EVENT_LABELS[eventType] ?? "אירוע";

export const getEventIcon = (eventType: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    binder_received: <FolderInput className="h-3.5 w-3.5" />,
    binder_returned: <FolderOutput className="h-3.5 w-3.5" />,
    binder_status_change: <ArrowLeftRight className="h-3.5 w-3.5" />,
    invoice_created: <Receipt className="h-3.5 w-3.5" />,
    invoice_attached: <Receipt className="h-3.5 w-3.5" />,
    charge_created: <CreditCard className="h-3.5 w-3.5" />,
    charge_issued: <CreditCard className="h-3.5 w-3.5" />,
    charge_paid: <CheckCircle className="h-3.5 w-3.5" />,
    notification: <Bell className="h-3.5 w-3.5" />,
    notification_sent: <Bell className="h-3.5 w-3.5" />,
    tax_deadline_due: <CalendarClock className="h-3.5 w-3.5" />,
    annual_report_status_changed: <FileText className="h-3.5 w-3.5" />,
  };
  return icons[eventType] ?? <AlertCircle className="h-3.5 w-3.5" />;
};

// ── Colors ─────────────────────────────────────────────────────────────────────

const EVENT_COLORS: Record<string, EventColorConfig> = {
  binder_received: {
    dotBg: "bg-primary-500",
    dotBorder: "border-primary-300",
    cardBorder: "border-r-primary-400",
    cardTint: "from-primary-50/60",
    badgeBg: "bg-primary-100",
    badgeText: "text-primary-700",
    chipActiveBg: "bg-primary-100",
    chipActiveText: "text-primary-800",
    chipActiveBorder: "border-primary-300",
    iconColor: "text-primary-600",
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
  binder_status_change: {
    dotBg: "bg-sky-500",
    dotBorder: "border-sky-300",
    cardBorder: "border-r-sky-400",
    cardTint: "from-sky-50/60",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    chipActiveBg: "bg-sky-100",
    chipActiveText: "text-sky-800",
    chipActiveBorder: "border-sky-300",
    iconColor: "text-sky-600",
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
  charge_issued: {
    dotBg: "bg-orange-500",
    dotBorder: "border-orange-300",
    cardBorder: "border-r-orange-400",
    cardTint: "from-orange-50/60",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    chipActiveBg: "bg-orange-100",
    chipActiveText: "text-orange-800",
    chipActiveBorder: "border-orange-300",
    iconColor: "text-orange-600",
  },
  charge_paid: {
    dotBg: "bg-green-500",
    dotBorder: "border-green-300",
    cardBorder: "border-r-green-400",
    cardTint: "from-green-50/60",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
    chipActiveBg: "bg-green-100",
    chipActiveText: "text-green-800",
    chipActiveBorder: "border-green-300",
    iconColor: "text-green-600",
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
EVENT_COLORS.invoice_attached = EVENT_COLORS.invoice_created;
EVENT_COLORS.tax_deadline_due = {
  dotBg: "bg-teal-500",
  dotBorder: "border-teal-300",
  cardBorder: "border-r-teal-400",
  cardTint: "from-teal-50/60",
  badgeBg: "bg-teal-100",
  badgeText: "text-teal-700",
  chipActiveBg: "bg-teal-100",
  chipActiveText: "text-teal-800",
  chipActiveBorder: "border-teal-300",
  iconColor: "text-teal-600",
};
EVENT_COLORS.annual_report_status_changed = {
  dotBg: "bg-indigo-500",
  dotBorder: "border-indigo-300",
  cardBorder: "border-r-indigo-400",
  cardTint: "from-indigo-50/60",
  badgeBg: "bg-indigo-100",
  badgeText: "text-indigo-700",
  chipActiveBg: "bg-indigo-100",
  chipActiveText: "text-indigo-800",
  chipActiveBorder: "border-indigo-300",
  iconColor: "text-indigo-600",
};

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

// ── Formatters ─────────────────────────────────────────────────────────────────

export const formatTimestamp = (timestamp: string): string =>
  format(parseISO(timestamp), "HH:mm", { locale: he });

export const formatDateHeading = (timestamp: string): string =>
  format(parseISO(timestamp), "EEEE, d MMMM yyyy", { locale: he });