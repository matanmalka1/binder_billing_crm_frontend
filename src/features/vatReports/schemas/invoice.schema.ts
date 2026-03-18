import { z } from "zod";
import type {
  CreateVatInvoicePayload,
  UpdateVatInvoicePayload,
} from "../../../api/vatReports.api";

const netAmountSchema = z
  .string()
  .trim()
  .min(1, "חובה להזין סכום")
  .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
    message: "סכום חייב להיות חיובי",
  });

export const vatInvoiceRowSchema = z.object({
  invoice_type: z.enum(["income", "expense"]),
  net_amount: netAmountSchema,
  expense_category: z.string().optional(),
  rate_type: z.string().optional(),
  document_type: z.string().optional(),
  invoice_number: z.string().trim().optional(),
  invoice_date: z.string().optional(),
  counterparty_name: z.string().trim().optional(),
});

export type VatInvoiceRowValues = z.infer<typeof vatInvoiceRowSchema>;

export const vatInvoiceEditSchema = z.object({
  net_amount: netAmountSchema,
  expense_category: z.string().optional(),
  rate_type: z.string().optional(),
  document_type: z.string().optional(),
  invoice_number: z.string().trim().optional(),
  invoice_date: z.string().optional(),
  counterparty_name: z.string().trim().optional(),
});

export type VatInvoiceEditValues = z.infer<typeof vatInvoiceEditSchema>;

export const toInvoiceEditPayload = (
  values: VatInvoiceEditValues,
): UpdateVatInvoicePayload => ({
  net_amount: Number(values.net_amount),
  vat_amount: parseFloat((Number(values.net_amount) * 0.18).toFixed(2)),
  expense_category: values.expense_category || null,
  rate_type: values.rate_type || undefined,
  document_type: values.document_type || null,
  invoice_number: values.invoice_number || undefined,
  invoice_date: values.invoice_date || undefined,
  counterparty_name: values.counterparty_name || undefined,
});

export const toInvoiceRowPayload = (
  values: VatInvoiceRowValues,
): CreateVatInvoicePayload => ({
  invoice_type: values.invoice_type,
  net_amount: Number(values.net_amount),
  vat_amount: parseFloat((Number(values.net_amount) * 0.18).toFixed(2)),
  expense_category: values.expense_category || null,
  rate_type: values.rate_type || undefined,
  document_type: values.document_type || null,
  invoice_number: values.invoice_number || undefined,
  invoice_date: values.invoice_date || undefined,
  counterparty_name: values.counterparty_name || undefined,
});
