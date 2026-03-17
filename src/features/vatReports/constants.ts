/**
 * Single source of truth for VAT expense category keys and labels.
 * Imported by schemas.ts, useVatWorkItemDetail.ts, and enums.ts helpers.
 */
import { getVatWorkItemStatusLabel } from "../../utils/enums";

export const INCOME_KEY = "income";

export const EXPENSE_CATEGORIES = [
  "office",
  "travel",
  "professional_services",
  "equipment",
  "rent",
  "salary",
  "marketing",
  "vehicle",
  "entertainment",
  "gifts",
  "other",
] as const;

export type ExpenseCategoryKey = (typeof EXPENSE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<string, string> = {
  [INCOME_KEY]: "הכנסות",
  office: "משרד",
  travel: "נסיעות",
  professional_services: "שירותים מקצועיים",
  equipment: "ציוד",
  rent: "שכירות",
  salary: "שכר עבודה",
  marketing: "שיווק",
  vehicle: "רכב פרטי",
  entertainment: "אירוח וכיבוד",
  gifts: "מתנות",
  other: "אחר",
};

export const CATEGORY_COLORS: Record<string, string> = {
  office: "bg-blue-400",
  travel: "bg-orange-400",
  professional_services: "bg-purple-400",
  equipment: "bg-gray-400",
  rent: "bg-amber-400",
  salary: "bg-rose-400",
  marketing: "bg-pink-400",
  vehicle: "bg-red-300",
  entertainment: "bg-yellow-400",
  gifts: "bg-lime-400",
  other: "bg-slate-400",
};

/** VAT deduction rates per expense category (frontend display only) */
export const DEDUCTION_RATES: Record<string, number> = {
  office: 1.0,
  travel: 2 / 3, // רכב — 66.67%
  professional_services: 1.0,
  equipment: 1.0,
  rent: 1.0,
  salary: 0.0,
  marketing: 1.0,
  vehicle: 0.0,
  entertainment: 0.0,
  gifts: 0.0,
  other: 0.0,
};

/** Like CATEGORY_LABELS but travel → "נסיעות/רכב" for the breakdown table */
export const CATEGORY_TABLE_LABELS: Record<string, string> = {
  ...CATEGORY_LABELS,
  travel: "רכב",
};

export const VAT_STATUS_BADGE_VARIANTS: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  pending_materials: "warning",
  material_received: "info",
  data_entry_in_progress: "info",
  ready_for_review: "warning",
  filed: "success",
};

export const VAT_CLIENT_SUMMARY_STATUS_VARIANTS: Record<string, "success" | "warning" | "info" | "neutral"> = {
  filed: "success",
  ready_for_review: "warning",
  data_entry_in_progress: "info",
  material_received: "neutral",
  pending_materials: "neutral",
};

export const VAT_WORKFLOW_STEPS = [
  "pending_materials",
  "material_received",
  "data_entry_in_progress",
  "ready_for_review",
  "filed",
] as const;

export const VAT_WORK_ITEMS_STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "כל הסטטוסים" },
  ...VAT_WORKFLOW_STEPS.map((status) => ({
    value: status,
    label: getVatWorkItemStatusLabel(status),
  })),
];

export const VAT_EXPENSE_CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "כל הקטגוריות" },
  ...EXPENSE_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] ?? c })),
];

export const VAT_FILING_METHOD_LABELS: Record<string, string> = {
  manual: "ידנית",
  online: "אונליין",
};

export const ISRAEL_VAT_RATE = 0.18;
export const ISRAEL_VAT_RATE_PERCENT = 18;
