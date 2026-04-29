import { useMemo } from "react";
import { addDays, format, subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { taxDeadlinesApi } from "@/features/taxDeadlines";
import { remindersApi } from "@/features/reminders";
import { dashboardQK } from "../api";
import { useRole } from "../../../hooks/useRole";
import type { SectionItem } from "../attentionPanelSections";
import { ADVISOR_TODAY_LIMITS } from "../advisorTodayConstants";
import { buildDeadlineItems, buildReminderItems } from "../advisorTodayHelpers";

export const useAdvisorToday = () => {
  const { isAdvisor } = useRole();

  const { today, weekEnd, staleReminderDate } = useMemo(() => {
    const now = new Date();
    return {
      today: format(now, "yyyy-MM-dd"),
      weekEnd: format(addDays(now, ADVISOR_TODAY_LIMITS.upcomingDeadlineDays), "yyyy-MM-dd"),
      staleReminderDate: subDays(now, ADVISOR_TODAY_LIMITS.staleReminderDays).toISOString(),
    };
  }, []);

  const deadlinesQuery = useQuery({
    enabled: isAdvisor,
    queryKey: dashboardQK.advisorToday.deadlines,
    queryFn: () =>
      taxDeadlinesApi.listTaxDeadlines({
        status: "pending",
        due_from: today,
        due_to: weekEnd,
        page: 1,
        page_size: ADVISOR_TODAY_LIMITS.taxDeadlinePageSize,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const remindersQuery = useQuery({
    enabled: isAdvisor,
    queryKey: dashboardQK.advisorToday.reminders,
    queryFn: () =>
      remindersApi.list({
        status: "pending",
        created_before: staleReminderDate,
        page_size: ADVISOR_TODAY_LIMITS.remindersPageSize,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const deadlineItems = useMemo<SectionItem[]>(
    () => buildDeadlineItems(deadlinesQuery.data?.items ?? []),
    [deadlinesQuery.data],
  );

  const reminderItems = useMemo<SectionItem[]>(
    () => buildReminderItems(remindersQuery.data?.items ?? []),
    [remindersQuery.data],
  );

  return { deadlineItems, reminderItems };
};
