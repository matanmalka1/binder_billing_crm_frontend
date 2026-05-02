import type { ElementType } from 'react'
import {
  Bell,
  Briefcase,
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  ChartColumn,
  LayoutDashboard,
  ReceiptText,
  Search,
  Settings,
  TableProperties,
  Users,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: ElementType
  end?: boolean
}

export interface NavGroup {
  label: string
  key: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'main',
    label: 'ראשי',
    items: [
      { to: '/', label: 'לוח בקרה', icon: LayoutDashboard, end: true },
      { to: '/clients', label: 'לקוחות', icon: Users },
      { to: '/binders', label: 'קלסרים', icon: Briefcase },
      { to: '/search', label: 'חיפוש', icon: Search },
      { to: '/charges', label: 'חיובים', icon: ReceiptText },
      { to: '/reminders', label: 'תזכורות', icon: Bell },
    ],
  },
  {
    key: 'tax',
    label: 'מיסים',
    items: [
      { to: '/tax/dashboard', label: 'לוח מסים', icon: FileSpreadsheet },
      { to: '/tax/vat', label: 'דוחות מע"מ (לקוח)', icon: ClipboardList },
      { to: '/tax/reports', label: 'דוחות שנתיים', icon: TableProperties, end: true },
      { to: '/tax/advance-payments', label: 'מקדמות', icon: CalendarDays },
      { to: '/tax/deadlines', label: 'מועדים', icon: FileSpreadsheet },
    ],
  },
  {
    key: 'reports',
    label: 'דוחות',
    items: [
      { to: '/reports/vat-compliance', label: 'ציות מע"מ', icon: ClipboardList },
      { to: '/reports/aging', label: 'דוח חובות לקוחות', icon: ChartColumn },
      { to: '/reports/annual-status', label: 'סטטוס דוחות שנתיים', icon: TableProperties },
      { to: '/reports/advance-payments', label: 'גביית מקדמות', icon: CalendarDays },
    ],
  },
  {
    key: 'settings',
    label: 'הגדרות',
    items: [{ to: '/settings/users', label: 'משתמשים', icon: Settings }],
  },
]
