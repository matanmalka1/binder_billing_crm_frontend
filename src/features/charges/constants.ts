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

export const CHARGE_TYPE_OPTIONS_WITH_ALL: { value: string; label: string }[] = [
  { value: "", label: "כל הסוגים" },
  { value: "one_time", label: getChargeTypeLabel("one_time") },
  { value: "retainer", label: getChargeTypeLabel("retainer") },
  { value: "hourly", label: getChargeTypeLabel("hourly") },
];

export const CHARGE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "one_time", label: getChargeTypeLabel("one_time") },
  { value: "retainer", label: getChargeTypeLabel("retainer") },
];
