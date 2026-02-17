import { useQuery } from "@tanstack/react-query";
import { taxDeadlinesApi } from "../../../api/taxDeadlines.api";
import { annualReportsApi } from "../../../api/annualReports.api";
import { remindersApi } from "../../../api/reminders.api";
import { chargesApi } from "../../../api/charges.api";

const sevenDaysFromNow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
};

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const useAdvisorToday = () => {
  const deadlinesQuery = useQuery({
    queryKey: ["advisor-today", "deadlines"] as const,
    queryFn: () =>
      taxDeadlinesApi.listTaxDeadlines({
        status: "pending",
        page: 1,
        page_size: 50,
      }),
  });

  const reportsQuery = useQuery({
    queryKey: ["advisor-today", "reports"] as const,
    queryFn: () =>
      annualReportsApi.listAnnualReports({ page: 1, page_size: 100 }),
  });

  const remindersQuery = useQuery({
    queryKey: ["advisor-today", "reminders"] as const,
    queryFn: () => remindersApi.list({ status: "pending", page_size: 100 }),
  });

  const chargesQuery = useQuery({
    queryKey: ["advisor-today", "charges"] as const,
    queryFn: () =>
      chargesApi.list({ status: "issued", page: 1, page_size: 100 }),
  });

  const today = new Date().toISOString().split("T")[0];
  const weekEnd = sevenDaysFromNow();
  const fourteenDaysAgo = daysAgo(14);
  const sevenDaysAgo = daysAgo(7);
  const sixtyDaysAgo = daysAgo(60);

  const upcomingDeadlines = (deadlinesQuery.data?.items ?? []).filter(
    (d) => d.due_date >= today && d.due_date <= weekEnd,
  );

  const stuckReports = (reportsQuery.data?.items ?? []).filter(
    (r) => r.created_at <= fourteenDaysAgo && r.stage !== "transmitted",
  );

  const pendingReminders = (remindersQuery.data?.items ?? []).filter(
    (r) => r.created_at <= sevenDaysAgo,
  );

  const openCharges = (chargesQuery.data?.items ?? []).filter(
    (c) => c.issued_at !== null && c.issued_at! <= sixtyDaysAgo,
  );

  const isLoading =
    deadlinesQuery.isPending ||
    reportsQuery.isPending ||
    remindersQuery.isPending ||
    chargesQuery.isPending;

  return {
    isLoading,
    upcomingDeadlines,
    stuckReports,
    pendingReminders,
    openCharges,
  };
};
