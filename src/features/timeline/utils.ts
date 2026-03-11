import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { createElement, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  Bell,
  CalendarClock,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  FolderInput,
  FolderOutput,
  PenLine,
  Receipt,
  Settings,
  Upload,
  UserCog,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

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
  client_created: "לקוח נוצר",
  client_info_updated: "פרטי לקוח עודכנו",
  tax_profile_updated: "פרופיל מס עודכן",
  reminder_created: "תזכורת נוצרה",
  document_uploaded: "מסמך הועלה",
  signature_request_created: "בקשת חתימה נוצרה",
};

const EVENT_ICONS: Record<string, LucideIcon> = {
  binder_received: FolderInput,
  binder_returned: FolderOutput,
  binder_status_change: ArrowLeftRight,
  invoice_created: Receipt,
  invoice_attached: Receipt,
  charge_created: CreditCard,
  charge_issued: CreditCard,
  charge_paid: CheckCircle,
  notification: Bell,
  notification_sent: Bell,
  tax_deadline_due: CalendarClock,
  annual_report_status_changed: FileText,
  client_created: UserPlus,
  client_info_updated: UserCog,
  tax_profile_updated: Settings,
  reminder_created: Clock,
  document_uploaded: Upload,
  signature_request_created: PenLine,
};

export const getEventTypeLabel = (eventType: string): string =>
  EVENT_LABELS[eventType] ?? "אירוע";

export const getEventIcon = (eventType: string): ReactNode => {
  const Icon = EVENT_ICONS[eventType] ?? AlertCircle;
  return createElement(Icon, { className: "h-3.5 w-3.5" });
};

export const formatTimestamp = (timestamp: string): string =>
  format(parseISO(timestamp), "HH:mm", { locale: he });

export const formatDateHeading = (timestamp: string): string =>
  format(parseISO(timestamp), "EEEE, d MMMM yyyy", { locale: he });
