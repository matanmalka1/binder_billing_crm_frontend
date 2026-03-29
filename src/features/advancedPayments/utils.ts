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
