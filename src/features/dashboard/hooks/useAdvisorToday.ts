import { useMemo } from "react";
import { differenceInCalendarDays, format, addDays, subDays, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { taxDeadlinesApi } from "@/features/taxDeadlines/api";
import { annualReportsApi, getStatusLabel } from "@/features/annualReports/api";
import { remindersApi } from "@/features/reminders/api";
import { dashboardQK } from "../api";
import { useRole } from "../../../hooks/useRole";
import { formatDate } from "../../../utils/utils";
import { getDeadlineTypeLabel } from "@/features/taxDeadlines/api";
import type { SectionItem } from "../utils";

// Compute once per calendar day — stable across re-renders within the same day
const getDateAnchors = () => {
  const now = new Date();
  return {
    today: format(now, "yyyy-MM-dd"),
    weekEnd: format(addDays(now, 7), "yyyy-MM-dd"),
    sevenDaysAgo: subDays(now, 7).toISOString(),
  };
};

const DONE_STATUSES = ["submitted", "accepted", "assessment_issued", "closed"];
const STUCK_REPORT_DAYS = 14;

const getReportAnchorDate = (createdAt: string, updatedAt: string) =>
  updatedAt ? parseISO(updatedAt) : parseISO(createdAt);

export const useAdvisorToday = () => {
  const { isAdvisor } = useRole();

  // Stable date anchors — only recomputed if the component remounts on a new day
  const { today, weekEnd, sevenDaysAgo } =
    useMemo(getDateAnchors, []);

  const deadlinesQuery = useQuery({
    enabled: isAdvisor,
    queryKey: dashboardQK.advisorToday.deadlines,
    queryFn: () =>
      taxDeadlinesApi.listTaxDeadlines({
        status: "pending",
        page: 1,
        page_size: 50,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const reportsQuery = useQuery({
    enabled: isAdvisor,
    queryKey: dashboardQK.advisorToday.reports,
    queryFn: () =>
      annualReportsApi.listReports({ page: 1, page_size: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const remindersQuery = useQuery({
    enabled: isAdvisor,
    queryKey: dashboardQK.advisorToday.reminders,
    queryFn: () => remindersApi.list({ status: "pending", page_size: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  const deadlineItems = useMemo<SectionItem[]>(
    () =>
      (deadlinesQuery.data?.items ?? [])
        .filter((d) => d.due_date >= today && d.due_date <= weekEnd)
        .map((d) => ({
          id: d.id,
          label: d.business_name ?? `עסק #${d.business_id}`,
          sublabel: `${getDeadlineTypeLabel(d.deadline_type)} — ${formatDate(d.due_date)}`,
          href: `/tax/deadlines`,
        })),
    [deadlinesQuery.data, today, weekEnd],
  );

  const stuckReportItems = useMemo<SectionItem[]>(
    () =>
      (reportsQuery.data?.items ?? [])
        .map((report) => {
          const anchorDate = getReportAnchorDate(report.created_at, report.updated_at);
          const staleDays = differenceInCalendarDays(new Date(), anchorDate);
          return { report, staleDays };
        })
        .filter(({ report, staleDays }) =>
          staleDays >= STUCK_REPORT_DAYS && !DONE_STATUSES.includes(report.status)
        )
        .sort((a, b) => b.staleDays - a.staleDays)
        .map(({ report, staleDays }) => ({
          id: report.id,
          label:
            report.business_name ??
            report.client_name ??
            `לקוח #${report.client_id}`,
          sublabel: `${report.tax_year} · ${getStatusLabel(report.status)} · ללא התקדמות ${staleDays} ימים`,
          href: `/tax/reports/${report.id}`,
        })),
    [reportsQuery.data],
  );

  const reminderItems = useMemo<SectionItem[]>(
    () =>
      (remindersQuery.data?.items ?? [])
        .filter((r) => r.created_at <= sevenDaysAgo)
        .map((r) => ({
          id: r.id,
          label: r.business_name ?? `עסק #${r.business_id}`,
          sublabel: r.message.slice(0, 48),
          href: `/reminders`,
        })),
    [remindersQuery.data, sevenDaysAgo],
  );

  const isLoading =
    isAdvisor &&
    (deadlinesQuery.isPending ||
      reportsQuery.isPending ||
      remindersQuery.isPending);

  return {
    isLoading,
    deadlineItems,
    stuckReportItems,
    reminderItems,
  };
};
