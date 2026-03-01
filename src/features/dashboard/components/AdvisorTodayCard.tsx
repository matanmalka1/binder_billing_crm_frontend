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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-blue-100/80 bg-white shadow-md">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-l from-blue-600 to-indigo-700 px-6 py-4">
        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* Glow orb */}
        <div className="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full bg-indigo-400 opacity-20 blur-2xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide text-white">מה לעשות היום</h2>
              <p className="mt-0.5 text-xs text-blue-200/70">
                {isLoading ? "טוען משימות..." : `${totalTasks} פריטים ממתינים לטיפול`}
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className={cn(
              "flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-2.5 text-xs font-bold tabular-nums",
              totalTasks > 0
                ? "bg-white/20 text-white ring-1 ring-white/30"
                : "bg-white/10 text-white/40"
            )}>
              {totalTasks}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            <span>טוען משימות...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4">
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