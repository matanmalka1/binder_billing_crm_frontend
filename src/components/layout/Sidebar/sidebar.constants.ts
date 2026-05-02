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
  roles?: Array<'advisor' | 'secretary'>
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
      { to: '/', label: 'לוח עבודה', icon: LayoutDashboard, end: true },
      { to: '/search', label: 'חיפוש', icon: Search },
    ],
  },
  {
    key: 'clients',
    label: 'לקוחות',
    items: [{ to: '/clients', label: 'לקוחות', icon: Users }],
  },
  {
    key: 'tax-work',
    label: 'עבודת מס',
    items: [
      { to: '/tax/vat', label: 'מע"מ', icon: ClipboardList },
      { to: '/tax/advance-payments', label: 'מקדמות', icon: CalendarDays },
      { to: '/tax/reports', label: 'דוחות שנתיים', icon: TableProperties, end: true },
      { to: '/tax/deadlines', label: 'מועדים', icon: FileSpreadsheet },
      { to: '/tax/dashboard', label: 'לוח מסים', icon: FileSpreadsheet },
    ],
  },
  {
    key: 'office-ops',
    label: 'תפעול משרד',
    items: [
      { to: '/binders', label: 'קלסרים', icon: Briefcase },
      { to: '/reminders', label: 'תזכורות', icon: Bell },
    ],
  },
  {
    key: 'finance',
    label: 'כספים',
    items: [
      { to: '/charges', label: 'חיובים', icon: ReceiptText },
      { to: '/reports/aging', label: 'גיול חובות', icon: ChartColumn },
    ],
  },
  {
    key: 'reports',
    label: 'דוחות ניהול',
    items: [
      { to: '/reports/vat-compliance', label: 'ציות מע"מ', icon: ClipboardList },
      { to: '/reports/annual-status', label: 'סטטוס דוחות שנתיים', icon: TableProperties },
      { to: '/reports/advance-payments', label: 'גביית מקדמות', icon: CalendarDays },
    ],
  },
  {
    key: 'settings',
    label: 'ניהול',
    items: [{ to: '/settings/users', label: 'משתמשים', icon: Settings, roles: ['advisor'] }],
  },
]
