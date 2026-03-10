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
  UserPlus,
  UserCog,
  Settings,
  Clock,
  Upload,
  PenLine,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { getEventColor } from "./timelineEventColors";

export { getEventColor };
export type { EventColorConfig } from "../types";

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
  client_created: "לקוח נוצר",
  client_info_updated: "פרטי לקוח עודכנו",
  tax_profile_updated: "פרופיל מס עודכן",
  reminder_created: "תזכורת נוצרה",
  document_uploaded: "מסמך הועלה",
  signature_request_created: "בקשת חתימה נוצרה",
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
    client_created: <UserPlus className="h-3.5 w-3.5" />,
    client_info_updated: <UserCog className="h-3.5 w-3.5" />,
    tax_profile_updated: <Settings className="h-3.5 w-3.5" />,
    reminder_created: <Clock className="h-3.5 w-3.5" />,
    document_uploaded: <Upload className="h-3.5 w-3.5" />,
    signature_request_created: <PenLine className="h-3.5 w-3.5" />,
  };
  return icons[eventType] ?? <AlertCircle className="h-3.5 w-3.5" />;
};

// ── Formatters ─────────────────────────────────────────────────────────────────

export const formatTimestamp = (timestamp: string): string =>
  format(parseISO(timestamp), "HH:mm", { locale: he });

export const formatDateHeading = (timestamp: string): string =>
  format(parseISO(timestamp), "EEEE, d MMMM yyyy", { locale: he });
