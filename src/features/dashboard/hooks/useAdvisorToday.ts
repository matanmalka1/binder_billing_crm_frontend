import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { taxDeadlinesApi } from "@/features/taxDeadlines";
import { remindersApi } from "@/features/reminders";
import { dashboardQK } from "../api";
import { useRole } from "../../../hooks/useRole";
import type { SectionItem } from "../utils";
import { ADVISOR_TODAY_LIMITS } from "../advisorTodayConstants";
import {
  buildDeadlineItems,
  buildReminderItems,
  getAdvisorTodayDateAnchors,
} from "../advisorTodayHelpers";

export const useAdvisorToday = () => {
  const { isAdvisor } = useRole();

  const { today, weekEnd, staleReminderDate } = useMemo(getAdvisorTodayDateAnchors, []);

  const deadlinesQuery = useQuery({
    enabled: isAdvisor,
    queryKey: dashboardQK.advisorToday.deadlines,
    queryFn: () =>
      taxDeadlinesApi.listTaxDeadlines({
        status: "pending",
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
        page_size: ADVISOR_TODAY_LIMITS.remindersPageSize,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const deadlineItems = useMemo<SectionItem[]>(
    () => buildDeadlineItems(deadlinesQuery.data?.items ?? [], today, weekEnd),
    [deadlinesQuery.data, today, weekEnd],
  );

  const reminderItems = useMemo<SectionItem[]>(
    () => buildReminderItems(remindersQuery.data?.items ?? [], staleReminderDate),
    [remindersQuery.data, staleReminderDate],
  );

  const isLoading = isAdvisor && (deadlinesQuery.isPending || remindersQuery.isPending);

  return { isLoading, deadlineItems, reminderItems };
};
