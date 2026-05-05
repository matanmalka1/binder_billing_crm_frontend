import { Bell, FileText, FolderOpen, Users } from 'lucide-react'
import type { DashboardOverviewResponse } from './api'
import type { StatItem } from './components/DashboardStatsGrid'

type DashboardStatsData = Pick<
  DashboardOverviewResponse,
  | 'total_clients'
  | 'active_clients'
  | 'active_binders'
  | 'binders_in_office'
  | 'binders_ready_for_pickup'
  | 'open_reminders'
  | 'vat_stats'
>

type VatPeriodType = 'monthly' | 'bimonthly'

const withParams = (base: string, params: Record<string, string>) => `${base}?${new URLSearchParams(params).toString()}`

const HREFS = {
  activeClients: withParams('/clients', { status: 'active' }),
  bindersInOffice: withParams('/binders', { status: 'in_office' }),
  remindersReady: withParams('/reminders', { status: 'pending', due: 'ready' }),
  vat: (period: string, periodType: VatPeriodType) => withParams('/tax/vat', { period, period_type: periodType }),
}

const vatVariant = (pending: number): StatItem['variant'] => (pending > 0 ? 'red' : 'green')

const buildVatStat = (
  key: string,
  title: string,
  stat: DashboardStatsData['vat_stats']['monthly'],
  periodType: VatPeriodType,
): StatItem => ({
  key,
  title,
  value: `${stat.pending.toLocaleString('he-IL')} דוחות ממתינים`,
  description: `${stat.period_label} · ${stat.status_label}`,
  icon: FileText,
  variant: vatVariant(stat.pending),
  urgent: stat.pending > 0,
  href: HREFS.vat(stat.period, periodType),
  progress: stat.completion_percent,
  actionLabel: stat.required > 0 ? 'פתח דוחות מע״מ' : 'צור תיק מע״מ ראשון',
})

export const buildDashboardStats = (data: DashboardStatsData): StatItem[] => [
  {
    key: 'active_clients',
    title: 'לקוחות',
    value: data.total_clients > 0 ? `${data.active_clients.toLocaleString('he-IL')} לקוחות פעילים` : 'אין לקוחות עדיין',
    description:
      data.total_clients > 0
        ? `מתוך ${data.total_clients.toLocaleString('he-IL')} סך הכל`
        : 'צור לקוח ראשון כדי להתחיל',
    icon: Users,
    variant: 'purple',
    href: HREFS.activeClients,
    actionLabel: data.active_clients > 0 ? 'פתח לקוחות פעילים' : 'הוסף לקוח ראשון',
  },
  {
    key: 'in_office',
    title: 'קלסרים במשרד',
    value:
      data.active_binders > 0 ? `${data.binders_in_office.toLocaleString('he-IL')} קלסרים במשרד` : 'אין קלסרים עדיין',
    description:
      data.active_binders > 0
        ? `מתוך ${data.active_binders.toLocaleString('he-IL')} קלסרים פעילים`
        : 'קלסרים ייפתחו לאחר יצירת לקוח',
    icon: FolderOpen,
    variant: 'blue',
    href: HREFS.bindersInOffice,
    actionLabel: data.active_binders > 0 ? 'פתח קלסרים במשרד' : 'הוסף לקוח ראשון',
  },
  {
    key: 'ready_reminders',
    title: 'תזכורות ידניות',
    value: `${data.open_reminders.toLocaleString('he-IL')} לטיפול עכשיו`,
    description: 'תזכורות ידניות שמועד הטיפול שלהן הגיע',
    icon: Bell,
    variant: 'amber',
    urgent: data.open_reminders > 0,
    href: HREFS.remindersReady,
    actionLabel: data.open_reminders > 0 ? 'פתח תזכורות' : 'צור תזכורת ראשונה',
  },
  buildVatStat('monthly_vat', 'מע״מ חודשי', data.vat_stats.monthly, 'monthly'),
  buildVatStat('bimonthly_vat', 'מע״מ דו־חודשי', data.vat_stats.bimonthly, 'bimonthly'),
]
