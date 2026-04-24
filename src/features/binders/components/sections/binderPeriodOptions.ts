import { buildYearOptions } from "@/utils/utils";

export const YEAR_OPTIONS = buildYearOptions().map((option) => ({
  ...option,
  disabled: false as const,
}));

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1).padStart(2, "0"),
  disabled: false as const,
}));
