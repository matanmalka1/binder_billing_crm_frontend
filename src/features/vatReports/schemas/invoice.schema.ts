import { z } from "zod";
import type { CreateVatInvoicePayload, UpdateVatInvoicePayload } from "../api";
import { ISRAEL_VAT_RATE } from "../constants";

const netAmountSchema = z
  .string()
  .trim()
  .min(1, "חובה להזין סכום")
  .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
    message: "סכום חייב להיות חיובי",
  });

const invoiceCommonFields = {
  net_amount: netAmountSchema,
  expense_category: z.string().optional(),
  rate_type: z.string().optional(),
  document_type: z.string().optional(),
  invoice_number: z.string().trim().optional(),
  invoice_date: z.string().optional(),
  counterparty_name: z.string().trim().optional(),
};

export const vatInvoiceRowSchema = z
  .object({
    invoice_type: z.enum(["income", "expense"]),
    ...invoiceCommonFields,
    counterparty_id: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.invoice_type === "expense" &&
      data.document_type === "tax_invoice" &&
      !data.counterparty_id
    ) {
      ctx.addIssue({
        code: "custom",
        message: "חובה להזין מספר עוסק של הספק",
        path: ["counterparty_id"],
      });
    }
  });

export type VatInvoiceRowValues = z.infer<typeof vatInvoiceRowSchema>;

export const vatInvoiceEditSchema = z.object(invoiceCommonFields);

export type VatInvoiceEditValues = z.infer<typeof vatInvoiceEditSchema>;

const buildInvoicePayloadBase = (values: VatInvoiceEditValues) => ({
  net_amount: values.net_amount,
  vat_amount: (Number(values.net_amount) * ISRAEL_VAT_RATE).toFixed(2),
  expense_category: values.expense_category || null,
  rate_type: values.rate_type || undefined,
  document_type: values.document_type || null,
  invoice_number: values.invoice_number || undefined,
  invoice_date: values.invoice_date || undefined,
  counterparty_name: values.counterparty_name || undefined,
});

export const toInvoiceEditPayload = (
  values: VatInvoiceEditValues,
): UpdateVatInvoicePayload => buildInvoicePayloadBase(values);

export const toInvoiceRowPayload = (
  values: VatInvoiceRowValues,
): CreateVatInvoicePayload => ({
  invoice_type: values.invoice_type,
  ...buildInvoicePayloadBase(values),
  counterparty_id: values.counterparty_id || undefined,
});
