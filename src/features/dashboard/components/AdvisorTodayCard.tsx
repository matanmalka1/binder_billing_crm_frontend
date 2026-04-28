import { CalendarClock, Clock, Bell, Sparkles } from "lucide-react";
import { AdvisorTodaySection } from "./AdvisorTodaySection";
import { useAdvisorToday } from "../hooks/useAdvisorToday";
import { ADVISOR_TODAY_COPY } from "../advisorTodayConstants";
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
          title={ADVISOR_TODAY_COPY.title}
          subtitle={isLoading ? ADVISOR_TODAY_COPY.loading : ADVISOR_TODAY_COPY.pendingCount(totalTasks)}
          count={!isLoading ? totalTasks : undefined}
          tone={totalTasks > 0 ? "amber" : "neutral"}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500" />
            <span>{ADVISOR_TODAY_COPY.loading}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3 bg-gray-50/50 p-4">
          <AdvisorTodaySection
            icon={CalendarClock}
            title={ADVISOR_TODAY_COPY.taxDeadlinesTitle}
            emptyLabel={ADVISOR_TODAY_COPY.taxDeadlinesEmpty}
            sectionIndex={0}
            items={deadlineItems}
            variant="deadline"
          />
          <AdvisorTodaySection
            icon={Clock}
            title={ADVISOR_TODAY_COPY.stuckReportsTitle}
            emptyLabel={ADVISOR_TODAY_COPY.stuckReportsEmpty}
            sectionIndex={1}
            items={stuckReportItems}
          />
          <AdvisorTodaySection
            icon={Bell}
            title={ADVISOR_TODAY_COPY.remindersTitle}
            emptyLabel={ADVISOR_TODAY_COPY.remindersEmpty}
            sectionIndex={2}
            items={reminderItems}
          />
        </div>
      )}
    </DashboardPanel>
  );
};

AdvisorTodayCard.displayName = "AdvisorTodayCard";
