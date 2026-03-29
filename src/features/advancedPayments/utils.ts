import { buildYearOptions, MONTH_NAMES } from "../../utils/utils";
import type { AdvancePaymentStatus } from "./types";

export { fmtCurrency, MONTH_OPTIONS } from "../../utils/utils";
export { MONTH_NAMES };

export const STATUS_VARIANT: Record<AdvancePaymentStatus, "success" | "warning" | "error" | "neutral"> = {
  paid: "success",
  partial: "warning",
  overdue: "error",
  pending: "neutral",
};

export const MONTH_SHORT_NAMES = [
  "ינו",
  "פבר",
  "מרץ",
  "אפר",
  "מאי",
  "יונ",
  "יול",
  "אוג",
  "ספט",
  "אוק",
  "נוב",
  "דצמ",
] as const;

export const YEAR_OPTIONS = buildYearOptions();

const getAdvancePaymentMonthIndex = (period: string) => {
  const month = Number(period.split("-")[1]);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month - 1 : null;
};

export const getAdvancePaymentMonthLabel = (period: string) => {
  const monthIndex = getAdvancePaymentMonthIndex(period);
  return monthIndex === null ? period : MONTH_NAMES[monthIndex];
};

export const getAdvancePaymentShortMonthLabel = (period: string) => {
  const monthIndex = getAdvancePaymentMonthIndex(period);
  return monthIndex === null ? period : MONTH_SHORT_NAMES[monthIndex];
};
