import { addDays, differenceInCalendarDays, format, parseISO, subDays } from "date-fns";
import { getStatusLabel } from "@/features/annualReports";
import type { annualReportsApi } from "@/features/annualReports";
import type { remindersApi } from "@/features/reminders";
import type { taxDeadlinesApi } from "@/features/taxDeadlines";
import { formatDate } from "@/utils/utils";
import {
  ADVISOR_TODAY_LIMITS,
  DASHBOARD_DEADLINE_LABELS,
  DONE_REPORT_STATUSES,
} from "./advisorTodayConstants";
import type { SectionItem } from "./utils";

type TaxDeadlineItems = NonNullable<Awaited<ReturnType<typeof taxDeadlinesApi.listTaxDeadlines>>["items"]>;
type AnnualReportItems = NonNullable<Awaited<ReturnType<typeof annualReportsApi.listReports>>["items"]>;
type ReminderItems = NonNullable<Awaited<ReturnType<typeof remindersApi.list>>["items"]>;

export const getAdvisorTodayDateAnchors = () => {
  const now = new Date();
  return {
    today: format(now, "yyyy-MM-dd"),
    weekEnd: format(addDays(now, ADVISOR_TODAY_LIMITS.upcomingDeadlineDays), "yyyy-MM-dd"),
    staleReminderDate: subDays(now, ADVISOR_TODAY_LIMITS.staleReminderDays).toISOString(),
  };
};

export const buildDeadlineItems = (
  deadlines: TaxDeadlineItems,
  today: string,
  weekEnd: string,
): SectionItem[] => {
  const grouped = new Map<string, SectionItem>();

  deadlines
    .filter((deadline) => deadline.due_date >= today && deadline.due_date <= weekEnd)
    .forEach((deadline) => {
      const label = DASHBOARD_DEADLINE_LABELS[deadline.deadline_type];
      if (!label) return;

      const key = `${deadline.deadline_type}-${deadline.due_date}`;
      if (grouped.has(key)) return;

      grouped.set(key, {
        id: deadline.id,
        label,
        sublabel: formatDate(deadline.due_date),
        href: "/tax/deadlines",
      });
    });

  return [...grouped.values()];
};

export const buildStuckReportItems = (reports: AnnualReportItems): SectionItem[] =>
  reports
    .map((report) => {
      const anchorDate = parseISO(report.updated_at || report.created_at);
      return {
        report,
        staleDays: differenceInCalendarDays(new Date(), anchorDate),
      };
    })
    .filter(
      ({ report, staleDays }) =>
        staleDays >= ADVISOR_TODAY_LIMITS.stuckReportDays &&
        !DONE_REPORT_STATUSES.includes(report.status as (typeof DONE_REPORT_STATUSES)[number]),
    )
    .sort((a, b) => b.staleDays - a.staleDays)
    .map(({ report, staleDays }) => ({
      id: report.id,
      label: report.business_name ?? report.client_name ?? `לקוח #${report.client_record_id}`,
      sublabel: `${report.tax_year} · ${getStatusLabel(report.status)} · ללא התקדמות ${staleDays} ימים`,
      href: `/tax/reports/${report.id}`,
    }));

export const buildReminderItems = (
  reminders: ReminderItems,
  staleReminderDate: string,
): SectionItem[] =>
  reminders
    .filter((reminder) => reminder.created_at <= staleReminderDate)
    .map((reminder) => ({
      id: reminder.id,
      label: reminder.business_name ?? `עסק #${reminder.business_id}`,
      sublabel: reminder.message.slice(0, ADVISOR_TODAY_LIMITS.reminderPreviewLength),
      href: "/reminders",
    }));
