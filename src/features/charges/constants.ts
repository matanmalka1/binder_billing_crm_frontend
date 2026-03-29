import { getChargeStatusLabel } from "../../utils/enums";
import { getChargeTypeLabel, CHARGE_TYPE_LABELS } from "./utils";

export { CHARGE_TYPE_LABELS };

export const chargeStatusVariants: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  draft: "neutral",
  issued: "info",
  paid: "success",
  canceled: "error",
};

export const CHARGE_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "כל הסטטוסים" },
  { value: "draft", label: getChargeStatusLabel("draft") },
  { value: "issued", label: getChargeStatusLabel("issued") },
  { value: "paid", label: getChargeStatusLabel("paid") },
  { value: "canceled", label: getChargeStatusLabel("canceled") },
];

export const CHARGE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "monthly_retainer", label: getChargeTypeLabel("monthly_retainer") },
  { value: "annual_report_fee", label: getChargeTypeLabel("annual_report_fee") },
  { value: "vat_filing_fee", label: getChargeTypeLabel("vat_filing_fee") },
  { value: "representation_fee", label: getChargeTypeLabel("representation_fee") },
  { value: "consultation_fee", label: getChargeTypeLabel("consultation_fee") },
  { value: "other", label: getChargeTypeLabel("other") },
];

export const CHARGE_TYPE_OPTIONS_WITH_ALL: { value: string; label: string }[] = [
  { value: "", label: "כל הסוגים" },
  ...CHARGE_TYPE_OPTIONS,
];
