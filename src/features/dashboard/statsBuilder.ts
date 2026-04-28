import { Bell, FileText, FolderOpen, Users } from "lucide-react";
import type { DashboardOverviewResponse } from "./api";
import type { StatItem } from "./components/DashboardStatsGrid";
import { DASHBOARD_STATS_LABELS } from "./statsConstants";
import { DASHBOARD_STAT_HREFS, buildVatReportsHref, type VatReportsPeriodType } from "./statsNavigation";

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

const formatVatValue = (submitted: number, required: number) =>
  `הוגשו ${submitted.toLocaleString("he-IL")} מתוך ${required.toLocaleString("he-IL")}`;

const formatPendingValue = (pending: number) =>
  `${pending.toLocaleString("he-IL")} ממתינים להגשה`;

const formatVatDescription = (stat: DashboardStatsData["vat_stats"]["monthly"]) =>
  `${formatVatValue(stat.submitted, stat.required)} · ${stat.period_label}`;

const formatReminderValue = (count: number) =>
  `${count.toLocaleString("he-IL")} ${DASHBOARD_STATS_LABELS.remindersValueSuffix}`;

const formatActiveClientsValue = (count: number) =>
  `${count.toLocaleString("he-IL")} לקוחות פעילים`;

const formatClientsDescription = (total: number) =>
  `מתוך ${total.toLocaleString("he-IL")} סך הכל`;

const formatBindersInOfficeValue = (count: number) =>
  `${count.toLocaleString("he-IL")} קלסרים במשרד`;

const formatBindersDescription = (activeBinders: number) =>
  `מתוך ${activeBinders.toLocaleString("he-IL")} קלסרים פעילים`;

const vatVariant = (pending: number): StatItem["variant"] =>
  pending > 0 ? "red" : "green";

const buildVatStat = (
  key: string,
  title: string,
  stat: DashboardStatsData["vat_stats"]["monthly"],
  periodType: VatReportsPeriodType,
): StatItem => ({
  key,
  title,
  value: formatPendingValue(stat.pending),
  description: formatVatDescription(stat),
  icon: FileText,
  variant: vatVariant(stat.pending),
  urgent: stat.pending > 0,
  href: buildVatReportsHref(stat.period, periodType),
  progress: stat.completion_percent,
  actionLabel: DASHBOARD_STATS_LABELS.vatAction,
});

export const buildDashboardStats = (data: DashboardStatsData): StatItem[] => [
  {
    key: "active_clients",
    title: DASHBOARD_STATS_LABELS.activeClientsTitle,
    value: formatActiveClientsValue(data.active_clients),
    description: formatClientsDescription(data.total_clients),
    icon: Users,
    variant: "purple",
    href: DASHBOARD_STAT_HREFS.activeClients,
    actionLabel: DASHBOARD_STATS_LABELS.activeClientsAction,
  },
  {
    key: "in_office",
    title: DASHBOARD_STATS_LABELS.bindersTitle,
    value: formatBindersInOfficeValue(data.binders_in_office),
    description: formatBindersDescription(data.active_binders),
    icon: FolderOpen,
    variant: "blue",
    href: DASHBOARD_STAT_HREFS.bindersInOffice,
    actionLabel: DASHBOARD_STATS_LABELS.bindersAction,
  },

  {
    key: "ready_reminders",
    title: DASHBOARD_STATS_LABELS.remindersTitle,
    value: formatReminderValue(data.open_reminders),
    description: DASHBOARD_STATS_LABELS.remindersDescription,
    icon: Bell,
    variant: "amber",
    urgent: data.open_reminders > 0,
    href: DASHBOARD_STAT_HREFS.remindersReady,
    actionLabel: DASHBOARD_STATS_LABELS.remindersAction,
  },
    buildVatStat(
    "monthly_vat",
    DASHBOARD_STATS_LABELS.monthlyVatTitle,
    data.vat_stats.monthly,
    "monthly",
  ),
  buildVatStat(
    "bimonthly_vat",
    DASHBOARD_STATS_LABELS.bimonthlyVatTitle,
    data.vat_stats.bimonthly,
    "bimonthly",
  ),
];
