import { makeClassGetter, makeLabelGetter } from "../utils/labels";
import { parseISO, differenceInCalendarDays } from "date-fns";

const deadlineTypeLabels = {
  vat: "מע״מ",
  advance_payment: "מקדמות",
  national_insurance: "ביטוח לאומי",
  annual_report: "דוח שנתי",
  other: "אחר",
};

const urgencyColors = {
  green: "bg-green-100 text-green-800 border-green-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  red: "bg-red-100 text-red-800 border-red-200",
  // Use a strong red tone so באיחור stands out clearly in the UI
  overdue: "bg-red-600 text-white border-red-700",
};

export const getDeadlineTypeLabel = makeLabelGetter(deadlineTypeLabels, "אחר");
export const getUrgencyColor = makeClassGetter(
  urgencyColors,
  undefined,
  "bg-gray-100 text-gray-800 border-gray-200",
);

export const formatCurrency = (amount: number | null, currency = "ILS"): string => {
  if (amount === null) return "—";
  return `${amount.toLocaleString("he-IL", { minimumFractionDigits: 2 })} ${currency}`;
};

export const calculateDaysRemaining = (dueDate: string): number => {
  const due = parseISO(dueDate);
  return differenceInCalendarDays(due, new Date());
};
