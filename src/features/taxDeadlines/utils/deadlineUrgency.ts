import { calculateDaysRemaining } from "../../../api/taxDeadlines.utils";

export type DeadlineUrgency = "green" | "yellow" | "red" | "overdue";

/**
 * Derives urgency level and display label for a deadline.
 * Centralizes logic previously duplicated in TaxDeadlinesTable and TaxDeadlineDrawer.
 */
export const getDeadlineUrgency = (
  dueDate: string,
  isCompleted: boolean,
): { urgency: DeadlineUrgency; daysRemaining: number; daysLabel: string } => {
  const daysRemaining = calculateDaysRemaining(dueDate);

  if (isCompleted) {
    return { urgency: "green", daysRemaining, daysLabel: "—" };
  }

  const urgency: DeadlineUrgency =
    daysRemaining < 0 ? "overdue"
    : daysRemaining <= 2 ? "red"
    : daysRemaining <= 7 ? "yellow"
    : "green";

  const daysLabel =
    daysRemaining < 0 ? `איחור של ${Math.abs(daysRemaining)} ימים`
    : daysRemaining === 0 ? "היום"
    : `${daysRemaining} ימים`;

  return { urgency, daysRemaining, daysLabel };
};

/** Shorter label variant used in the table (abbreviated) */
export const getDeadlineDaysLabelShort = (
  daysRemaining: number,
  isCompleted: boolean,
): string => {
  if (isCompleted) return "—";
  if (daysRemaining < 0) return `איחור ${Math.abs(daysRemaining)}י׳`;
  if (daysRemaining === 0) return "היום";
  return `${daysRemaining} ימים`;
};