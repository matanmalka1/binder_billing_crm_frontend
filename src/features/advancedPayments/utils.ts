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

const getAdvancePaymentEndMonthIndex = (startMonthIndex: number, periodMonthsCount: 1 | 2) =>
  startMonthIndex + periodMonthsCount - 1;

export const getAdvancePaymentMonthLabel = (period: string, periodMonthsCount: 1 | 2 = 1) => {
  const monthIndex = getAdvancePaymentMonthIndex(period);
  if (monthIndex === null) return period;
  if (periodMonthsCount === 1) return MONTH_NAMES[monthIndex];

  const endMonthIndex = getAdvancePaymentEndMonthIndex(monthIndex, periodMonthsCount);
  if (endMonthIndex >= MONTH_NAMES.length) return period;
  return `${MONTH_NAMES[monthIndex]}-${MONTH_NAMES[endMonthIndex]}`;
};

export const getAdvancePaymentShortMonthLabel = (period: string, periodMonthsCount: 1 | 2 = 1) => {
  const monthIndex = getAdvancePaymentMonthIndex(period);
  if (monthIndex === null) return period;
  if (periodMonthsCount === 1) return MONTH_SHORT_NAMES[monthIndex];

  const endMonthIndex = getAdvancePaymentEndMonthIndex(monthIndex, periodMonthsCount);
  if (endMonthIndex >= MONTH_SHORT_NAMES.length) return period;
  return `${MONTH_SHORT_NAMES[monthIndex]}-${MONTH_SHORT_NAMES[endMonthIndex]}`;
};
