import type { ListBindersParams } from "../../api/binders.types";

export type BindersFilters = ListBindersParams;

export interface BindersFiltersBarProps {
  filters: BindersFilters;
  onFilterChange: (name: keyof BindersFilters, value: string) => void;
}

// ── Shared variant maps (used by both table columns and drawer) ────────────

export const BINDER_WORK_STATE_VARIANTS: Record<string, "neutral" | "info" | "success"> = {
  waiting_for_work: "neutral",
  in_progress: "info",
  completed: "success",
};

export const BINDER_SIGNAL_VARIANTS: Record<string, "error" | "warning" | "info" | "neutral"> = {
  missing_permanent_documents: "warning",
  unpaid_charges: "warning",
  ready_for_pickup: "info",
  idle_binder: "neutral",
};

// ── Domain constants ───────────────────────────────────────────────────────

export const BINDER_TYPE_OPTIONS = [
  { value: "", label: "בחר סוג חומר...", disabled: true },
  { value: "vat", label: 'מע"מ' },
  { value: "income_tax", label: "מס הכנסה" },
  { value: "national_insurance", label: "ביטוח לאומי" },
  { value: "capital_declaration", label: "הצהרת הון" },
  { value: "annual_report", label: "דוח שנתי" },
  { value: "salary", label: "שכר" },
  { value: "bookkeeping", label: "הנהלת חשבונות" },
  { value: "other", label: "אחר" },
] as const;

export const BINDER_STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "in_office", label: "במשרד" },
  { value: "ready_for_pickup", label: "מוכן לאיסוף" },
] as const;