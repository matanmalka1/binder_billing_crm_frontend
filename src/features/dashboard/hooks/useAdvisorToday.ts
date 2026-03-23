import { useMemo } from "react";
import { format, addDays, subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { taxDeadlinesApi } from "@/features/taxDeadlines/api";
import { annualReportsApi, getStatusLabel } from "@/features/annualReports/api";
import { remindersApi } from "@/features/reminders/api";
import { chargesApi } from "@/features/charges/api";
import { QK } from "../../../lib/queryKeys";
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
    fourteenDaysAgo: subDays(now, 14).toISOString(),
    sixtyDaysAgo: subDays(now, 60).toISOString(),
  };
};

const DONE_STATUSES = ["submitted", "accepted", "assessment_issued", "closed"];

export const useAdvisorToday = () => {
  const { isAdvisor } = useRole();

  // Stable date anchors — only recomputed if the component remounts on a new day
  const { today, weekEnd, sevenDaysAgo, fourteenDaysAgo, sixtyDaysAgo } =
    useMemo(getDateAnchors, []);

  const deadlinesQuery = useQuery({
    enabled: isAdvisor,
    queryKey: QK.advisorToday.deadlines,
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
    queryKey: QK.advisorToday.reports,
    queryFn: () =>
      annualReportsApi.listReports({ page: 1, page_size: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const remindersQuery = useQuery({
    enabled: isAdvisor,
    queryKey: QK.advisorToday.reminders,
    queryFn: () => remindersApi.list({ status: "pending", page_size: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  const chargesQuery = useQuery({
    enabled: isAdvisor,
    queryKey: QK.charges.list({
      status: "issued",
      issued_before: sixtyDaysAgo,
      page_size: 20,
    }),
    queryFn: () =>
      chargesApi.list({
        status: "issued",
        issued_before: sixtyDaysAgo,
        page: 1,
        page_size: 20,
      }),
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
        .filter((r) => r.created_at <= fourteenDaysAgo && !DONE_STATUSES.includes(r.status))
        .map((r) => ({
          id: r.id,
          label: r.business_name ?? `עסק #${r.business_id}`,
          sublabel: `${r.tax_year} — ${getStatusLabel(r.status)}`,
          href: `/tax/reports/${r.id}`,
        })),
    [reportsQuery.data, fourteenDaysAgo],
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

  const chargeItems = useMemo<SectionItem[]>(
    () =>
      (chargesQuery.data?.items ?? [])
        .filter((c) => c.issued_at !== null && c.issued_at! <= sixtyDaysAgo)
        .map((c) => ({
          id: c.id,
          label: c.business_name ?? `עסק #${c.business_id}`,
          sublabel: `חיוב #${c.id}${c.issued_at ? ` — ${formatDate(c.issued_at)}` : ""}`,
          href: `/charges/${c.id}`,
        })),
    [chargesQuery.data, sixtyDaysAgo],
  );

  const isLoading =
    isAdvisor &&
    (deadlinesQuery.isPending ||
      reportsQuery.isPending ||
      remindersQuery.isPending ||
      chargesQuery.isPending);

  return {
    isLoading,
    deadlineItems,
    stuckReportItems,
    reminderItems,
    chargeItems,
  };
};
