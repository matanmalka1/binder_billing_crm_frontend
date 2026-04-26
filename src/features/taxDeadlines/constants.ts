import { TAX_DEADLINE_TYPE_LABELS, getDeadlineTypeLabel } from "../../utils/enums";
import { ALL_STATUSES_OPTION, ALL_TYPES_OPTION } from "@/constants/filterOptions.constants";

export { getDeadlineTypeLabel as getTaxDeadlineTypeLabel };

export const TAX_DEADLINE_TYPE_OPTIONS = Object.entries(TAX_DEADLINE_TYPE_LABELS)
  .filter(([value]) => value !== "")
  .map(([value, label]) => ({ value, label }));

export const TAX_DEADLINE_FILTER_TYPE_OPTIONS = [
  ALL_TYPES_OPTION,
  ...TAX_DEADLINE_TYPE_OPTIONS,
];

export const TAX_DEADLINE_STATUS_OPTIONS = [
  ALL_STATUSES_OPTION,
  { value: "pending", label: "ממתין" },
  { value: "completed", label: "הושלם" },
  { value: "canceled", label: "בוטל" },
];

export const getTaxDeadlineStatusLabel = (value: string) =>
  TAX_DEADLINE_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value;
