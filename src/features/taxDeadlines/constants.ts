export const TAX_DEADLINE_TYPE_OPTIONS = [
  { value: "vat", label: "מע״מ" },
  { value: "advance_payment", label: "מקדמות" },
  { value: "national_insurance", label: "ביטוח לאומי" },
  { value: "annual_report", label: "דוח שנתי" },
  { value: "other", label: "אחר" },
];

export const TAX_DEADLINE_FILTER_TYPE_OPTIONS = [
  { value: "", label: "כל הסוגים" },
  ...TAX_DEADLINE_TYPE_OPTIONS,
];

export const TAX_DEADLINE_STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "pending", label: "ממתין" },
  { value: "completed", label: "הושלם" },
];

export const getTaxDeadlineTypeLabel = (value: string) =>
  TAX_DEADLINE_FILTER_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;

export const getTaxDeadlineStatusLabel = (value: string) =>
  TAX_DEADLINE_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value;
