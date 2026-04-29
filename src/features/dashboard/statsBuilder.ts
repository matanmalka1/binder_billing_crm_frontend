import { Bell, FileText, FolderOpen, Users } from "lucide-react";
import type { DashboardOverviewResponse } from "./api";
import type { StatItem } from "./components/DashboardStatsGrid";

type DashboardStatsData = Pick<
  DashboardOverviewResponse,
  | "total_clients"
  | "active_clients"
  | "active_binders"
  | "binders_in_office"
  | "binders_ready_for_pickup"
  | "open_reminders"
  | "vat_stats"
>;

type VatPeriodType = "monthly" | "bimonthly";

const withParams = (base: string, params: Record<string, string>) =>
  `${base}?${new URLSearchParams(params).toString()}`;

const HREFS = {
  activeClients: withParams("/clients", { status: "active" }),
  bindersInOffice: withParams("/binders", { status: "in_office" }),
  remindersReady: withParams("/reminders", { status: "pending", due: "ready" }),
  vat: (period: string, periodType: VatPeriodType) =>
    withParams("/tax/vat", { period, period_type: periodType }),
};

const vatVariant = (pending: number): StatItem["variant"] =>
  pending > 0 ? "red" : "green";

const buildVatStat = (
  key: string,
  title: string,
  stat: DashboardStatsData["vat_stats"]["monthly"],
  periodType: VatPeriodType,
): StatItem => ({
  key,
  title,
  value: `${stat.pending.toLocaleString("he-IL")} ממתינים להגשה`,
  description: `הוגשו ${stat.submitted.toLocaleString("he-IL")} מתוך ${stat.required.toLocaleString("he-IL")} · ${stat.period_label}`,
  icon: FileText,
  variant: vatVariant(stat.pending),
  urgent: stat.pending > 0,
  href: HREFS.vat(stat.period, periodType),
  progress: stat.completion_percent,
  actionLabel: 'פתח דוחות מע״מ',
});

export const buildDashboardStats = (data: DashboardStatsData): StatItem[] => [
  {
    key: "active_clients",
    title: "לקוחות",
    value: `${data.active_clients.toLocaleString("he-IL")} לקוחות פעילים`,
    description: `מתוך ${data.total_clients.toLocaleString("he-IL")} סך הכל`,
    icon: Users,
    variant: "purple",
    href: HREFS.activeClients,
    actionLabel: "פתח לקוחות פעילים",
  },
  {
    key: "in_office",
    title: "קלסרים במשרד",
    value: `${data.binders_in_office.toLocaleString("he-IL")} קלסרים במשרד`,
    description: `מתוך ${data.active_binders.toLocaleString("he-IL")} קלסרים פעילים`,
    icon: FolderOpen,
    variant: "blue",
    href: HREFS.bindersInOffice,
    actionLabel: "פתח קלסרים במשרד",
  },
  {
    key: "ready_reminders",
    title: "תזכורות לטיפול",
    value: `${data.open_reminders.toLocaleString("he-IL")} לטיפול עכשיו`,
    description: "כולל תזכורות שהגיע מועד השליחה שלהן",
    icon: Bell,
    variant: "amber",
    urgent: data.open_reminders > 0,
    href: HREFS.remindersReady,
    actionLabel: "פתח תזכורות",
  },
  buildVatStat("monthly_vat", 'מע״מ חודשי', data.vat_stats.monthly, "monthly"),
  buildVatStat("bimonthly_vat", 'מע״מ דו־חודשי', data.vat_stats.bimonthly, "bimonthly"),
];
