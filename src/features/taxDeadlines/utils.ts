import { calculateDaysRemaining } from "./api";
import type { TaxDeadlineResponse } from "./api";
import {
  HEBREW_MONTHS,
  HEBREW_SHORT_MONTHS,
  VAT_FILING_DUE_DAY,
} from "./constants";
import type {
  CreateTaxDeadlineForm,
  EditTaxDeadlineForm,
  TimelineFilters,
} from "./types";
import type { VatType } from "@/features/clients";

type DeadlinePeriodFields = Pick<TaxDeadlineResponse, "deadline_type" | "period" | "tax_year">;

export const isAnnualReportDeadline = (deadlineType: string) => deadlineType === "annual_report";

export const getCurrentTaxYear = () => new Date().getFullYear();

export const getSelectedTaxYear = (period: string) => Number(period || getCurrentTaxYear());

export const toDeadlinePayloadPeriod = (
  values: Pick<CreateTaxDeadlineForm | EditTaxDeadlineForm, "deadline_type" | "period">,
) => (isAnnualReportDeadline(values.deadline_type) ? null : values.period || null);

export const toDeadlinePayloadTaxYear = (
  values: Pick<CreateTaxDeadlineForm | EditTaxDeadlineForm, "deadline_type" | "period">,
) => (isAnnualReportDeadline(values.deadline_type) ? getSelectedTaxYear(values.period) : null);

export const computeVatDueDate = (period: string, vatType: VatType | null) => {
  if (!period || vatType === "exempt") return "";

  const [yearPart, monthPart] = period.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  if (!Number.isInteger(year) || !Number.isInteger(month)) return "";

  const filingMonthOffset = vatType === "bimonthly" ? 2 : 1;
  const dueMonthIndex = month - 1 + filingMonthOffset;
  const dueYear = year + Math.floor(dueMonthIndex / 12);
  const dueMonth = (dueMonthIndex % 12) + 1;

  return `${dueYear}-${String(dueMonth).padStart(2, "0")}-${String(VAT_FILING_DUE_DAY).padStart(2, "0")}`;
};

export const getDeadlineDaysLabel = (
  dueDate: string,
  inactive: boolean,
): { daysRemaining: number; daysLabel: string } => {
  const daysRemaining = calculateDaysRemaining(dueDate);

  if (inactive) return { daysRemaining, daysLabel: "—" };

  const daysLabel =
    daysRemaining < 0 ? `באיחור ${Math.abs(daysRemaining)} ימים`
    : daysRemaining === 0 ? "היום"
    : daysRemaining === 1 ? "מחר"
    : `בעוד ${daysRemaining} ימים`;

  return { daysRemaining, daysLabel };
};

export const getDeadlineDaysLabelShort = (
  daysRemaining: number,
  inactive: boolean,
): string => {
  if (inactive) return "—";
  if (daysRemaining < 0) return `באיחור ${Math.abs(daysRemaining)} ימים`;
  if (daysRemaining === 0) return "היום";
  if (daysRemaining === 1) return "מחר";
  return `בעוד ${daysRemaining} ימים`;
};

export const getTaxDeadlinePeriodLabel = (deadline: DeadlinePeriodFields): string => {
  if (isAnnualReportDeadline(deadline.deadline_type)) {
    return deadline.tax_year != null ? `שנת ${deadline.tax_year}` : "ללא תקופה";
  }

  if (!deadline.period) return "ללא תקופה";

  const periodMatch = /^(\d{4})-(\d{2})$/.exec(deadline.period);
  if (!periodMatch) return deadline.period;

  const year = periodMatch[1];
  const month = HEBREW_SHORT_MONTHS[Number(periodMatch[2]) - 1];

  return month ? `${month} ${year}` : deadline.period;
};

export const getTaxDeadlineMonthGroupKey = (dueDate: string): string => {
  const [year, month] = dueDate.split("-");
  return `${year}-${month}`;
};

export const getTaxDeadlineMonthGroupLabel = (key: string): string => {
  const [year, month] = key.split("-");
  const monthName = HEBREW_MONTHS[Number(month) - 1] ?? month;
  return `${monthName} ${year}`;
};

export const groupTaxDeadlinesByMonth = (deadlines: TaxDeadlineResponse[]) => {
  const groups = new Map<string, TaxDeadlineResponse[]>();

  for (const deadline of deadlines) {
    const key = getTaxDeadlineMonthGroupKey(deadline.due_date);
    groups.set(key, [...(groups.get(key) ?? []), deadline]);
  }

  return Array.from(groups.entries()).map(([key, items]) => ({
    key,
    label: getTaxDeadlineMonthGroupLabel(key),
    items,
  }));
};

export const getDeadlineSummary = (deadlines: TaxDeadlineResponse[]) =>
  deadlines.reduce(
    (summary, deadline) => {
      const isPending = deadline.status === "pending";

      if (isPending) {
        summary.pending += 1;
        if (deadline.urgency_level === "overdue") summary.overdue += 1;
        if (deadline.payment_amount !== null) {
          summary.totalOpen += Number(deadline.payment_amount);
        }
      }

      if (deadline.status === "completed") summary.completed += 1;

      return summary;
    },
    { overdue: 0, pending: 0, completed: 0, totalOpen: 0 },
  );

const getDeadlineSortRank = (deadline: TaxDeadlineResponse) => {
  if (deadline.status !== "pending") return 2;
  return deadline.urgency_level === "overdue" ? 0 : 1;
};

export const sortTaxDeadlines = (deadlines: TaxDeadlineResponse[]) =>
  [...deadlines].sort((a, b) => {
    const rankDelta = getDeadlineSortRank(a) - getDeadlineSortRank(b);
    if (rankDelta !== 0) return rankDelta;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

export const getTimelineYearOptions = (deadlines: TaxDeadlineResponse[]) => {
  const years = Array.from(new Set(deadlines.map((deadline) => new Date(deadline.due_date).getFullYear())))
    .filter((year) => Number.isFinite(year))
    .sort((a, b) => b - a);

  return [{ value: "", label: "כל השנים" }, ...years.map((year) => ({ value: String(year), label: String(year) }))];
};

export const filterTimelineDeadlines = (
  deadlines: TaxDeadlineResponse[],
  filters: TimelineFilters,
) => sortTaxDeadlines(deadlines.filter((deadline) => {
  if (filters.status && deadline.status !== filters.status) return false;
  if (filters.type && deadline.deadline_type !== filters.type) return false;
  if (filters.year && new Date(deadline.due_date).getFullYear() !== Number(filters.year)) return false;
  if (filters.overdueOnly) {
    return deadline.status === "pending" && deadline.urgency_level === "overdue";
  }
  return true;
}));

export const findMatchingDuplicateDeadline = (
  deadlines: TaxDeadlineResponse[],
  values: Pick<CreateTaxDeadlineForm, "deadline_type" | "period">,
  excludeId?: number,
) => deadlines.find((deadline) => {
  if (deadline.id === excludeId) return false;
  if (!isAnnualReportDeadline(values.deadline_type)) return deadline.period === values.period;
  return deadline.tax_year === getSelectedTaxYear(values.period);
}) ?? null;
