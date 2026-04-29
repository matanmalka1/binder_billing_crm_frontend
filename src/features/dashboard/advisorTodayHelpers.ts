import { addDays, format, subDays } from "date-fns";
import type { taxDeadlinesApi } from "@/features/taxDeadlines";
import type { remindersApi } from "@/features/reminders";
import { formatDate } from "@/utils/utils";
import { ADVISOR_TODAY_LIMITS, DASHBOARD_DEADLINE_LABELS } from "./advisorTodayConstants";
import type { SectionItem } from "./utils";

type TaxDeadlineItems = NonNullable<Awaited<ReturnType<typeof taxDeadlinesApi.listTaxDeadlines>>["items"]>;
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
    .filter((d) => d.due_date >= today && d.due_date <= weekEnd)
    .forEach((d) => {
      const label = DASHBOARD_DEADLINE_LABELS[d.deadline_type];
      if (!label) return;
      const key = `${d.deadline_type}-${d.due_date}`;
      if (!grouped.has(key)) {
        grouped.set(key, { id: d.id, label, sublabel: formatDate(d.due_date), href: "/tax/deadlines" });
      }
    });

  return [...grouped.values()];
};

export const buildReminderItems = (
  reminders: ReminderItems,
  staleReminderDate: string,
): SectionItem[] =>
  reminders
    .filter((r) => r.created_at <= staleReminderDate)
    .map((r) => ({
      id: r.id,
      label: r.business_name ?? `עסק #${r.business_id}`,
      sublabel: r.message.slice(0, ADVISOR_TODAY_LIMITS.reminderPreviewLength),
      href: "/reminders",
    }));
