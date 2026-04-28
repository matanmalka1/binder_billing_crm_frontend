import { CalendarClock, Clock, Bell, Sparkles } from "lucide-react";
import { AdvisorTodaySection } from "./AdvisorTodaySection";
import { useAdvisorToday } from "../hooks/useAdvisorToday";
import { DashboardPanel, DashboardSectionHeader } from "./DashboardPrimitives";

export const AdvisorTodayCard = () => {
  const {
    isLoading,
    deadlineItems,
    stuckReportItems,
    reminderItems,
  } = useAdvisorToday();

  const totalTasks =
    deadlineItems.length +
    stuckReportItems.length +
    reminderItems.length;

  return (
    <DashboardPanel>
      <div className="border-b border-gray-100 px-5 py-4">
        <DashboardSectionHeader
          icon={Sparkles}
          title="מה לעשות היום"
          subtitle={isLoading ? "טוען משימות..." : `${totalTasks} פריטים ממתינים לטיפול`}
          count={!isLoading ? totalTasks : undefined}
          tone={totalTasks > 0 ? "amber" : "neutral"}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" />
            <span>טוען משימות...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3 bg-gray-50/50 p-4">
          <AdvisorTodaySection
            icon={CalendarClock}
            title="מועדי מס השבוע"
            emptyLabel="אין מועדים קרובים"
            sectionIndex={0}
            items={deadlineItems}
            variant="deadline"
          />
          <AdvisorTodaySection
            icon={Clock}
            title="דוחות תקועים"
            emptyLabel="אין דוחות תקועים"
            sectionIndex={1}
            items={stuckReportItems}
          />
          <AdvisorTodaySection
            icon={Bell}
            title="תזכורות פתוחות"
            emptyLabel="אין תזכורות תלויות"
            sectionIndex={2}
            items={reminderItems}
          />
        </div>
      )}
    </DashboardPanel>
  );
};

AdvisorTodayCard.displayName = "AdvisorTodayCard";
