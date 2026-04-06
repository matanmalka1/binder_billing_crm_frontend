import { makeClassGetter, makeLabelGetter } from "@/utils/labels";
import { parseISO, differenceInCalendarDays } from "date-fns";

const deadlineTypeLabels = {
  vat: "מע״מ",
  advance_payment: "מקדמות",
  national_insurance: "ביטוח לאומי",
  annual_report: "דוח שנתי",
  other: "אחר",
};

const urgencyColors = {
  green: "bg-positive-100 text-positive-800 border-positive-200",
  yellow: "bg-warning-100 text-warning-800 border-warning-200",
  red: "bg-negative-100 text-negative-800 border-negative-200",
  overdue: "bg-negative-600 text-white border-negative-700",
};

export const getDeadlineTypeLabel = makeLabelGetter(deadlineTypeLabels, "אחר");
export const getUrgencyColor = makeClassGetter(
  urgencyColors,
  undefined,
  "bg-gray-100 text-gray-800 border-gray-200",
);

export const formatCurrency = (amount: string | number | null): string => {
  if (amount === null) return "—";
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return "—";
  return `${numeric.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪`;
};

export const calculateDaysRemaining = (dueDate: string): number => {
  const due = parseISO(dueDate);
  return differenceInCalendarDays(due, new Date());
};
