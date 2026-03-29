import { getAdvancePaymentStatusLabel } from "../../utils/enums";
import type { AdvancePaymentStatus } from "./types";
import { MONTH_OPTIONS } from "./utils";

export const ADVANCE_PAYMENT_STATUS_FILTERS: AdvancePaymentStatus[] = [
  "pending",
  "paid",
  "partial",
  "overdue",
];

export const ADVANCE_PAYMENT_STATUS_OPTIONS: { value: AdvancePaymentStatus; label: string }[] =
  ADVANCE_PAYMENT_STATUS_FILTERS.map((status) => ({
    value: status,
    label: getAdvancePaymentStatusLabel(status),
  }));

export const ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL: {
  value: AdvancePaymentStatus | "";
  label: string;
}[] = [
  { value: "", label: "כל הסטטוסים" },
  { value: "overdue", label: getAdvancePaymentStatusLabel("overdue") },
  { value: "pending", label: getAdvancePaymentStatusLabel("pending") },
  { value: "partial", label: getAdvancePaymentStatusLabel("partial") },
  { value: "paid", label: getAdvancePaymentStatusLabel("paid") },
];

export const ADVANCE_PAYMENT_MONTH_FILTER_OPTIONS = [
  { value: "", label: "כל החודשים" },
  ...MONTH_OPTIONS,
];

export const PAGE_SIZE = 50;
