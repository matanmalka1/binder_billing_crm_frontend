import { BINDER_TYPE_LABELS, BINDER_STATUS_LABELS } from "../../utils/enums";
export { getBinderTypeLabel } from "../../utils/enums";

export const BINDER_STATUS_VARIANTS: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  in_office: "info",
  ready_for_pickup: "success",
  returned: "neutral",
};

export const BINDER_TYPE_OPTIONS: { value: string; label: string; disabled?: true }[] = [
  { value: "", label: "בחר סוג חומר...", disabled: true },
  ...Object.entries(BINDER_TYPE_LABELS).map(([value, label]) => ({ value, label })),
];

export const BINDER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "כל הסטטוסים" },
  ...Object.entries(BINDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];
