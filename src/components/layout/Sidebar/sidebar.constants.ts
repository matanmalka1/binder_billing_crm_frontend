import type { ElementType } from "react";
import {
  Bell,
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileSignature,
  FileSpreadsheet,
  KanbanSquare,
  LayoutDashboard,
  ReceiptText,
  Search,
  Settings,
  Users,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: ElementType;
  end?: boolean;
}

export interface NavGroup {
  label: string;
  key: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "main",
    label: "ראשי",
    items: [
      { to: "/", label: "לוח בקרה", icon: LayoutDashboard, end: true },
      { to: "/binders", label: "קלסרים", icon: Briefcase },
      { to: "/clients", label: "לקוחות", icon: Users },
      { to: "/search", label: "חיפוש", icon: Search },
      { to: "/charges", label: "חיובים", icon: ReceiptText },
      { to: "/reminders", label: "תזכורות", icon: Bell },
      { to: "/signature-requests", label: "בקשות חתימה", icon: FileSignature },
    ],
  },
  {
    key: "tax",
    label: "מיסים",
    items: [
      { to: "/tax/vat", label: 'דוחות מע"מ (לקוח)', icon: ClipboardList },
      { to: "/tax/reports", label: "לוח דוחות שנתיים", icon: KanbanSquare, end: true },
      { to: "/tax/advance-payments", label: "מקדמות", icon: CalendarDays },
      { to: "/tax/deadlines", label: "מועדים", icon: FileSpreadsheet },
      { to: "/tax/vat-compliance", label: 'דוח ציות מע"מ', icon: ClipboardList },
    ],
  },
  {
    key: "settings",
    label: "הגדרות",
    items: [{ to: "/settings/users", label: "משתמשים", icon: Settings }],
  },
];
