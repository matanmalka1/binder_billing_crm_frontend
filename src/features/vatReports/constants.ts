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
  "fuel",
  "vehicle_maintenance",
  "vehicle_insurance",
  "vehicle_leasing",
  "tolls_and_parking",
  "entertainment",
  "gifts",
  "communication",
  "insurance",
  "maintenance",
  "municipal_tax",
  "utilities",
  "postage_and_shipping",
  "bank_fees",
  "mixed_expense",
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
  fuel: "דלק",
  vehicle_maintenance: "תחזוקת רכב",
  vehicle_insurance: "ביטוח רכב",
  vehicle_leasing: "ליסינג רכב",
  tolls_and_parking: "חניה וכבישי אגרה",
  entertainment: "אירוח וכיבוד",
  gifts: "מתנות",
  communication: "תקשורת",
  insurance: "ביטוח",
  maintenance: "תחזוקה",
  municipal_tax: "ארנונה",
  utilities: "חשמל ומים",
  postage_and_shipping: "משלוחים ודואר",
  bank_fees: "עמלות בנק",
  mixed_expense: "הוצאה מעורבת",
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
  fuel: "bg-red-500",
  vehicle_maintenance: "bg-red-400",
  vehicle_insurance: "bg-slate-500",
  vehicle_leasing: "bg-rose-500",
  tolls_and_parking: "bg-amber-500",
  entertainment: "bg-yellow-400",
  gifts: "bg-lime-400",
  communication: "bg-cyan-500",
  insurance: "bg-indigo-400",
  maintenance: "bg-teal-500",
  municipal_tax: "bg-zinc-500",
  utilities: "bg-sky-500",
  postage_and_shipping: "bg-emerald-500",
  bank_fees: "bg-violet-500",
  mixed_expense: "bg-orange-500",
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
  vehicle: 2 / 3,
  fuel: 2 / 3,
  vehicle_maintenance: 2 / 3,
  vehicle_insurance: 0.0,
  vehicle_leasing: 2 / 3,
  tolls_and_parking: 2 / 3,
  entertainment: 0.0,
  gifts: 0.0,
  communication: 2 / 3,
  insurance: 0.0,
  maintenance: 1.0,
  municipal_tax: 0.0,
  utilities: 1.0,
  postage_and_shipping: 1.0,
  bank_fees: 1.0,
  mixed_expense: 2 / 3,
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
  representative: "דרך מערכת המייצגים",
};

export const VAT_FILING_METHODS = ["online", "manual", "representative"] as const;
export const DEFAULT_VAT_FILING_METHOD = VAT_FILING_METHODS[0];

export const VAT_FILE_MODAL_MESSAGES = {
  invalidAmendmentId: "מזהה ההגשה המקורית חייב להיות מספר",
  filingSuccess: "התיק הוגש בהצלחה",
  filingError: "שגיאה בהגשה",
} as const;

export const VAT_RATE_TYPE_LABELS: Record<string, string> = {
  standard: "רגיל",
  exempt: "פטור",
  zero_rate: "אפס",
};

export const DEFAULT_RATE_TYPE = "standard" as const;

// Mirrors app/vat_reports/services/constants.py: EXCEPTIONAL_INVOICE_THRESHOLD
export const VAT_EXCEPTIONAL_INVOICE_THRESHOLD = 25_000;
export const VAT_EXCEPTIONAL_INVOICE_TOOLTIP = `חשבונית מעל ${VAT_EXCEPTIONAL_INVOICE_THRESHOLD.toLocaleString("en-US")} ₪ — נדרש דיווח מיוחד`;

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  tax_invoice: "חשבונית מס",
  transaction_invoice: "חשבונית עסקה",
  receipt: "קבלה",
  consolidated: "חשבונית מרוכזת",
  self_invoice: "חשבונית עצמית",
  credit_note: "הודעת זיכוי",
};

export const ISRAEL_VAT_RATE = 0.18;
export const ISRAEL_VAT_RATE_PERCENT = 18;

// Any field backed by a backend enum MUST use a Zod enum in the frontend schema.
export const VAT_RATE_TYPES = ["standard", "exempt", "zero_rate"] as const;
export const DOCUMENT_TYPES = [
  "tax_invoice",
  "transaction_invoice",
  "receipt",
  "consolidated",
  "self_invoice",
  "credit_note",
] as const;
