import type { CreateVatInvoicePayload } from "../../../api/vatReports.api";
import { z } from "zod";
import {
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  type ExpenseCategoryKey,
} from "../constants";

export const amountField = z
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
