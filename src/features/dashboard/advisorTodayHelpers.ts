import type { taxDeadlinesApi } from "@/features/taxDeadlines";
import type { remindersApi } from "@/features/reminders";
import { formatDate } from "@/utils/utils";
import { ADVISOR_TODAY_LIMITS, DASHBOARD_DEADLINE_COPY } from "./advisorTodayConstants";
import type { SectionItem } from "./attentionPanelSections";

type TaxDeadlineItems = NonNullable<Awaited<ReturnType<typeof taxDeadlinesApi.listTaxDeadlines>>["items"]>;
type ReminderItems = NonNullable<Awaited<ReturnType<typeof remindersApi.list>>["items"]>;

const dayMs = 86_400_000;

const getDaysUntilLabel = (dueDate: string): string => {
  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((due.getTime() - today.getTime()) / dayMs);
  if (days < 0) return `באיחור ${Math.abs(days)} ימים`;
  if (days === 0) return "היום";
  return `עוד ${days} ימים`;
};

export const buildDeadlineItems = (deadlines: TaxDeadlineItems): SectionItem[] => {
  const grouped = new Map<string, SectionItem & { count: number }>();

  deadlines.forEach((d) => {
    const copy = DASHBOARD_DEADLINE_COPY[d.deadline_type];
    if (!copy) return;
    const key = `${d.deadline_type}-${d.due_date}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: d.id,
        label: copy.title,
        sublabel: `${copy.action} עד ${formatDate(d.due_date)} · ${getDaysUntilLabel(d.due_date)}`,
        description: "1 לקוח רלוונטי",
        href: "/tax/deadlines",
        count: 1,
      });
      return;
    }
    const item = grouped.get(key)!;
    item.count += 1;
    item.description = `${item.count.toLocaleString("he-IL")} לקוחות רלוונטיים`;
  });

  return [...grouped.values()];
};

export const buildReminderItems = (reminders: ReminderItems): SectionItem[] =>
  reminders.map((r) => ({
    id: r.id,
    label: r.business_name ?? `עסק #${r.business_id}`,
    sublabel: r.message.slice(0, ADVISOR_TODAY_LIMITS.reminderPreviewLength),
    href: "/reminders",
  }));
