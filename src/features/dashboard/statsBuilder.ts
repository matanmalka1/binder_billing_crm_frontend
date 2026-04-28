import { Bell, FileText, FolderOpen, Users } from "lucide-react";
import type { DashboardOverviewResponse } from "./api";
import type { StatItem } from "./components/DashboardStatsGrid";
import { DASHBOARD_STATS_LABELS, DASHBOARD_STATS_LINKS } from "./statsConstants";

type DashboardStatsData = Pick<
  DashboardOverviewResponse,
  "active_clients" | "binders_in_office" | "open_reminders" | "vat_stats"
>;

const formatVatValue = (submitted: number, required: number) =>
  `${submitted.toLocaleString("he-IL")} / ${required.toLocaleString("he-IL")} הוגשו`;

const formatPendingVat = (pending: number) =>
  `${pending.toLocaleString("he-IL")} ממתינים להגשה`;

const vatVariant = (pending: number): StatItem["variant"] =>
  pending > 0 ? "red" : "green";

const buildVatStat = (
  key: string,
  title: string,
  stat: DashboardStatsData["vat_stats"]["monthly"],
): StatItem => ({
  key,
  title,
  value: formatVatValue(stat.submitted, stat.required),
  description: formatPendingVat(stat.pending),
  eyebrow: stat.period_label,
  icon: FileText,
  variant: vatVariant(stat.pending),
  urgent: stat.pending > 0,
  href: DASHBOARD_STATS_LINKS.vatReports,
  progress: stat.completion_percent,
  actionLabel: DASHBOARD_STATS_LABELS.vatAction,
});

export const buildDashboardStats = (data: DashboardStatsData): StatItem[] => [
  {
    key: "active_clients",
    title: DASHBOARD_STATS_LABELS.activeClientsTitle,
    value: data.active_clients,
    description: DASHBOARD_STATS_LABELS.activeClientsDescription,
    icon: Users,
    variant: "purple",
    href: DASHBOARD_STATS_LINKS.clients,
  },
  {
    key: "in_office",
    title: DASHBOARD_STATS_LABELS.bindersTitle,
    value: data.binders_in_office,
    description: DASHBOARD_STATS_LABELS.bindersDescription,
    icon: FolderOpen,
    variant: "blue",
    href: DASHBOARD_STATS_LINKS.bindersInOffice,
  },
  buildVatStat("monthly_vat", DASHBOARD_STATS_LABELS.monthlyVatTitle, data.vat_stats.monthly),
  buildVatStat(
    "bimonthly_vat",
    DASHBOARD_STATS_LABELS.bimonthlyVatTitle,
    data.vat_stats.bimonthly,
  ),
  {
    key: "actionable_reminders",
    title: DASHBOARD_STATS_LABELS.remindersTitle,
    value: data.open_reminders,
    description: DASHBOARD_STATS_LABELS.remindersDescription,
    icon: Bell,
    variant: "amber",
    urgent: data.open_reminders > 0,
    href: DASHBOARD_STATS_LINKS.reminders,
    actionLabel: DASHBOARD_STATS_LABELS.remindersAction,
  },
];
