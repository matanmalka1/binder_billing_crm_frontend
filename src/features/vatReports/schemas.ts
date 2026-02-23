import { z } from "zod";
import type { CreateVatWorkItemPayload, CreateVatInvoicePayload } from "../../api/vatReports.api";

const periodPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

export const vatWorkItemCreateSchema = z.object({
  client_id: z
    .string()
    .trim()
    .min(1, "יש להזין מזהה לקוח")
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, {
      message: "יש להזין מזהה לקוח חיובי",
    }),
  period: z
    .string()
    .trim()
    .min(1, "יש להזין תקופה")
    .refine((value) => periodPattern.test(value), {
      message: "פורמט תקופה חייב להיות YYYY-MM",
    }),
  mark_pending: z.boolean(),
  pending_materials_note: z.string().trim().optional(),
});

export type VatWorkItemCreateFormValues = z.infer<typeof vatWorkItemCreateSchema>;

export const vatWorkItemCreateDefaultValues: VatWorkItemCreateFormValues = {
  client_id: "",
  period: "",
  mark_pending: false,
  pending_materials_note: "",
};

export const toCreateVatWorkItemPayload = (
  values: VatWorkItemCreateFormValues,
): CreateVatWorkItemPayload => ({
  client_id: Number(values.client_id),
  period: values.period.trim(),
  mark_pending: values.mark_pending,
  pending_materials_note: values.pending_materials_note?.trim() || null,
});

// ── Category-based data entry ─────────────────────────────────────────────────

const amountField = z
  .string()
  .trim()
  .refine((v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0), {
    message: "סכום לא תקין",
  });

export const categoryRowSchema = z.object({
  net_amount: amountField,
  vat_amount: amountField,
});

export type CategoryRowValues = z.infer<typeof categoryRowSchema>;

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

export type CategoryEntryFormValues = {
  income: CategoryRowValues;
  categories: Record<ExpenseCategoryKey, CategoryRowValues>;
};

const emptyRow = (): CategoryRowValues => ({ net_amount: "", vat_amount: "" });

export const categoryEntryDefaultValues = (): CategoryEntryFormValues => ({
  income: emptyRow(),
  categories: Object.fromEntries(
    EXPENSE_CATEGORIES.map((k) => [k, emptyRow()]),
  ) as Record<ExpenseCategoryKey, CategoryRowValues>,
});

/** Convert filled rows into one CreateVatInvoicePayload per non-empty category. */
export const toCategoryInvoicePayloads = (
  values: CategoryEntryFormValues,
  period: string,
): CreateVatInvoicePayload[] => {
  const payloads: CreateVatInvoicePayload[] = [];
  const date = `${period}-01`;
  const ts = Date.now();

  const incomeNet = Number(values.income.net_amount);
  const incomeVat = Number(values.income.vat_amount);
  if (incomeNet > 0 || incomeVat > 0) {
    payloads.push({
      invoice_type: "income",
      invoice_number: `${period}-income-${ts}`,
      invoice_date: date,
      counterparty_name: "הכנסות",
      net_amount: incomeNet,
      vat_amount: incomeVat,
    });
  }

  for (const cat of EXPENSE_CATEGORIES) {
    const row = values.categories[cat];
    const net = Number(row.net_amount);
    const vat = Number(row.vat_amount);
    if (net > 0 || vat > 0) {
      payloads.push({
        invoice_type: "expense",
        invoice_number: `${period}-${cat}-${ts}`,
        invoice_date: date,
        counterparty_name: CATEGORY_LABELS[cat],
        net_amount: net,
        vat_amount: vat,
        expense_category: cat,
      });
    }
  }

  return payloads;
};
