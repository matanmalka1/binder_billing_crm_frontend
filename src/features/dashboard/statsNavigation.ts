import { DASHBOARD_STATS_LINKS } from "./statsConstants";

export type VatReportsPeriodType = "monthly" | "bimonthly";

const withParams = (basePath: string, params: Record<string, string>) =>
  `${basePath}?${new URLSearchParams(params).toString()}`;

export const DASHBOARD_STAT_HREFS = {
  activeClients: withParams(DASHBOARD_STATS_LINKS.clients, { status: "active" }),
  bindersInOffice: withParams(DASHBOARD_STATS_LINKS.binders, { status: "in_office" }),
  remindersReady: withParams(DASHBOARD_STATS_LINKS.reminders, {
    status: "pending",
    due: "ready",
  }),
} as const;

export const buildVatReportsHref = (period: string, periodType: VatReportsPeriodType) => {
  const params = new URLSearchParams({ period, period_type: periodType });
  return `${DASHBOARD_STATS_LINKS.vatReports}?${params.toString()}`;
};
