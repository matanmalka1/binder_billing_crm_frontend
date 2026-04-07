import { TAX_DEADLINE_TYPE_LABELS, getDeadlineTypeLabel } from "../../utils/enums";

export { getDeadlineTypeLabel as getTaxDeadlineTypeLabel };

export const TAX_DEADLINE_TYPE_OPTIONS = Object.entries(TAX_DEADLINE_TYPE_LABELS)
  .filter(([value]) => value !== "")
  .map(([value, label]) => ({ value, label }));

export const TAX_DEADLINE_FILTER_TYPE_OPTIONS = [
  { value: "", label: "כל הסוגים" },
  ...TAX_DEADLINE_TYPE_OPTIONS,
];

export const TAX_DEADLINE_STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "pending", label: "ממתין" },
  { value: "completed", label: "הושלם" },
];

export const getTaxDeadlineStatusLabel = (value: string) =>
  TAX_DEADLINE_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value;
