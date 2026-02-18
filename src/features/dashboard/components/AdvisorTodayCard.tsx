import { CalendarClock, Clock, Bell, Receipt } from "lucide-react";
import { AdvisorTodaySection } from "./AdvisorTodaySection";
import { useAdvisorToday } from "../hooks/useAdvisorToday";
import { formatDate, cn } from "../../../utils/utils";
import { getStatusLabel } from "../../../api/Annualreports.extended.utils";

AdvisorTodayCard.displayName = "AdvisorTodayCard";

export function AdvisorTodayCard() {
  const {
    isLoading,
    upcomingDeadlines,
    stuckReports,
    pendingReminders,
    openCharges,
  } = useAdvisorToday();

  const totalTasks =
    upcomingDeadlines.length +
    stuckReports.length +
    pendingReminders.length +
    openCharges.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-l from-blue-50/60 to-transparent px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">מה לעשות היום</h2>
          <p className="text-xs text-gray-400">סיכום פעולות נדרשות לסיום</p>
        </div>
        {!isLoading && (
          <div className={cn(
            "flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl px-2.5 text-sm font-bold",
            totalTasks > 0
              ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
              : "bg-gray-100 text-gray-500"
          )}>
            {totalTasks}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-sm text-gray-400">
          טוען משימות...
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-gray-100 md:grid-cols-2 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse">
          <AdvisorTodaySection
            icon={CalendarClock}
            title="מועדי מס השבוע"
            emptyLabel="אין מועדים קרובים"
            severity="critical"
            items={upcomingDeadlines.map((d) => ({
              id: d.id,
              label: `לקוח #${d.client_id} — ${d.deadline_type}`,
              sublabel: formatDate(d.due_date),
            }))}
          />
          <AdvisorTodaySection
            icon={Clock}
            title="לקוחות תקועים"
            emptyLabel="אין דוחות תקועים"
            severity="warning"
            items={stuckReports.map((r) => ({
              id: r.id,
              label: `לקוח #${r.client_id} — ${r.tax_year}`,
              sublabel: `סטטוס: ${getStatusLabel(r.status)}`,
            }))}
          />
          <AdvisorTodaySection
            icon={Bell}
            title="ממתינים למסמכים"
            emptyLabel="אין תזכורות תלויות"
            severity="info"
            items={pendingReminders.map((r) => ({
              id: r.id,
              label: `לקוח #${r.client_id}`,
              sublabel: r.message.slice(0, 48),
            }))}
          />
          <AdvisorTodaySection
            icon={Receipt}
            title="חיובים פתוחים"
            emptyLabel="אין חיובים ישנים"
            severity="warning"
            items={openCharges.map((c) => ({
              id: c.id,
              label: `חיוב #${c.id} — לקוח #${c.client_id}`,
              sublabel: c.issued_at ? formatDate(c.issued_at) : "",
            }))}
          />
        </div>
      )}
    </div>
  );
}
