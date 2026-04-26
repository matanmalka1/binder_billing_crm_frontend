import { calculateDaysRemaining } from "./api";
import type { TaxDeadlineResponse } from "./api";

type DeadlinePeriodFields = Pick<TaxDeadlineResponse, "deadline_type" | "period" | "tax_year">;

const HEBREW_SHORT_MONTHS = [
  "ינו׳",
  "פבר׳",
  "מרץ",
  "אפר׳",
  "מאי",
  "יוני",
  "יולי",
  "אוג׳",
  "ספט׳",
  "אוק׳",
  "נוב׳",
  "דצמ׳",
];

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
  if (deadline.deadline_type === "annual_report") {
    return deadline.tax_year != null ? `שנת ${deadline.tax_year}` : "ללא תקופה";
  }

  if (!deadline.period) return "ללא תקופה";

  const periodMatch = /^(\d{4})-(\d{2})$/.exec(deadline.period);
  if (!periodMatch) return deadline.period;

  const year = periodMatch[1];
  const month = HEBREW_SHORT_MONTHS[Number(periodMatch[2]) - 1];

  return month ? `${month} ${year}` : deadline.period;
};
