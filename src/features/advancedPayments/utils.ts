import { buildYearOptions } from "../../utils/utils";
import type { AdvancePaymentStatus } from "./types";

export { fmtCurrency, MONTH_NAMES, MONTH_OPTIONS } from "../../utils/utils";

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

export const getAdvancePaymentBalanceMeta = (
  totalExpected: string | number,
  totalPaid: string | number,
) => {
  const balance = Number(totalExpected) - Number(totalPaid);
  return {
    balance,
    absBalance: Math.abs(balance),
    variant: balance > 0 ? "orange" : balance < 0 ? "blue" : "green",
    description: balance > 0 ? "נותר לתשלום" : balance < 0 ? "שולם ביתר" : "הכל שולם",
  };
};
