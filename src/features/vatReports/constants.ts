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