import {
  getChargeStatusLabel,
  CHARGE_TYPE_LABELS,
  CHARGE_STATUS_VARIANTS as chargeStatusVariants,
} from "../../utils/enums";

export { CHARGE_TYPE_LABELS, chargeStatusVariants };

export const CHARGE_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "כל הסטטוסים" },
  { value: "draft", label: getChargeStatusLabel("draft") },
  { value: "issued", label: getChargeStatusLabel("issued") },
  { value: "paid", label: getChargeStatusLabel("paid") },
  { value: "canceled", label: getChargeStatusLabel("canceled") },
];

export const CHARGE_TYPE_OPTIONS: { value: string; label: string }[] =
  Object.entries(CHARGE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

export const CHARGE_TYPE_OPTIONS_WITH_ALL: { value: string; label: string }[] = [
  { value: "", label: "כל הסוגים" },
  ...CHARGE_TYPE_OPTIONS,
];
