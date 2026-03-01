import { CalendarClock, Clock, Bell, Receipt, Sparkles } from "lucide-react";
import { AdvisorTodaySection } from "./AdvisorTodaySection";
import { useAdvisorToday } from "../hooks/useAdvisorToday";
import { cn } from "../../../utils/utils";

export const AdvisorTodayCard = () => {
  const {
    isLoading,
    deadlineItems,
    stuckReportItems,
    reminderItems,
    chargeItems,
  } = useAdvisorToday();

  const totalTasks =
    deadlineItems.length +
    stuckReportItems.length +
    reminderItems.length +
    chargeItems.length;

  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-elevation-2">
      {/* Card header */}
      <div className="relative overflow-hidden bg-gradient-to-l from-slate-800 to-slate-900 px-6 py-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
        />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              totalTasks > 0 ? "bg-blue-500/20" : "bg-white/10"
            )}>
              <Sparkles className={cn(
                "h-5 w-5",
                totalTasks > 0 ? "text-blue-200" : "text-white/70"
              )} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">מה לעשות היום</h2>
              <p className="text-xs text-white/50 mt-0.5">
                {isLoading ? "טוען משימות..." : `${totalTasks} פריטים ממתינים לטיפול`}
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className={cn(
              "flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums",
              totalTasks > 0 ? "bg-blue-500/80 text-white" : "bg-white/10 text-white/40"
            )}>
              {totalTasks}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-sm text-gray-400">
          טוען משימות...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 bg-gray-50/70 p-4 md:grid-cols-4">
          <AdvisorTodaySection
            icon={CalendarClock}
            title="מועדי מס השבוע"
            emptyLabel="אין מועדים קרובים"
            severity="critical"
            sectionIndex={0}
            items={deadlineItems}
          />
          <AdvisorTodaySection
            icon={Clock}
            title="לקוחות תקועים"
            emptyLabel="אין דוחות תקועים"
            severity="warning"
            sectionIndex={1}
            items={stuckReportItems}
          />
          <AdvisorTodaySection
            icon={Bell}
            title="ממתינים למסמכים"
            emptyLabel="אין תזכורות תלויות"
            severity="info"
            sectionIndex={2}
            items={reminderItems}
          />
          <AdvisorTodaySection
            icon={Receipt}
            title="חיובים פתוחים"
            emptyLabel="אין חיובים ישנים"
            severity="warning"
            sectionIndex={3}
            items={chargeItems}
          />
        </div>
      )}
    </div>
  );
};

AdvisorTodayCard.displayName = "AdvisorTodayCard";
