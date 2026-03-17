/**
 * Single source of truth for VAT expense category keys and labels.
 * Imported by schemas.ts, useVatWorkItemDetail.ts, and enums.ts helpers.
 */

export const INCOME_KEY = "income";

export const EXPENSE_CATEGORIES = [
  "office",
  "travel",
  "professional_services",
  "equipment",
  "rent",
  "salary",
  "marketing",
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
  other: 0.0,
};

/** Like CATEGORY_LABELS but travel → "רכב" for the breakdown table */
export const CATEGORY_TABLE_LABELS: Record<string, string> = {
  ...CATEGORY_LABELS,
  travel: "רכב",
};