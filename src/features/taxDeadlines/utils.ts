import { calculateDaysRemaining } from "./api";
import type { TaxDeadlineResponse } from "./api";

type DeadlinePeriodFields = Pick<TaxDeadlineResponse, "deadline_type" | "period" | "tax_year">;

export const getDeadlineDaysLabel = (
  dueDate: string,
  inactive: boolean,
): { daysRemaining: number; daysLabel: string } => {
  const daysRemaining = calculateDaysRemaining(dueDate);

  if (inactive) return { daysRemaining, daysLabel: "—" };

  const daysLabel =
    daysRemaining < 0 ? `איחור של ${Math.abs(daysRemaining)} ימים`
    : daysRemaining === 0 ? "היום"
    : `${daysRemaining} ימים`;

  return { daysRemaining, daysLabel };
};

export const getDeadlineDaysLabelShort = (
  daysRemaining: number,
  inactive: boolean,
): string => {
  if (inactive) return "—";
  if (daysRemaining < 0) return `איחור ${Math.abs(daysRemaining)}י׳`;
  if (daysRemaining === 0) return "היום";
  return `${daysRemaining} ימים`;
};

export const getTaxDeadlinePeriodLabel = (deadline: DeadlinePeriodFields): string => {
  if (deadline.deadline_type === "annual_report") {
    return deadline.tax_year != null ? String(deadline.tax_year) : "—";
  }
  return deadline.period || "—";
};
