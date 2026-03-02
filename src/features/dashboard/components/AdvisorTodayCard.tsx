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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
              <Sparkles className="h-3.5 w-3.5 text-gray-500" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-wide text-gray-700">מה לעשות היום</h2>
              <p className="text-[11px] text-gray-400">
                {isLoading ? "טוען משימות..." : `${totalTasks} פריטים ממתינים לטיפול`}
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className={cn(
              "flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums",
              totalTasks > 0
                ? "bg-gray-100 text-gray-600"
                : "bg-gray-50 text-gray-300"
            )}>
              {totalTasks}
            </div>
          )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" />
            <span>טוען משימות...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4">
          <AdvisorTodaySection
            icon={CalendarClock}
            title="מועדי מס השבוע"
            emptyLabel="אין מועדים קרובים"

            sectionIndex={0}
            items={deadlineItems}
          />
          <AdvisorTodaySection
            icon={Clock}
            title="לקוחות תקועים"
            emptyLabel="אין דוחות תקועים"

            sectionIndex={1}
            items={stuckReportItems}
          />
          <AdvisorTodaySection
            icon={Bell}
            title="ממתינים למסמכים"
            emptyLabel="אין תזכורות תלויות"

            sectionIndex={2}
            items={reminderItems}
          />
          <AdvisorTodaySection
            icon={Receipt}
            title="חיובים פתוחים"
            emptyLabel="אין חיובים ישנים"

            sectionIndex={3}
            items={chargeItems}
          />
        </div>
      )}
    </div>
  );
};

AdvisorTodayCard.displayName = "AdvisorTodayCard";