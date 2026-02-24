import { z } from "zod";

// ── Create Report ──────────────────────────────────────────────────────────

export const createReportSchema = z.object({
  client_id: z.string().min(1, "שדה חובה"),
  tax_year: z.string().min(4, "שנה לא תקינה"),
  client_type: z.enum(["individual", "self_employed", "corporation", "partnership"]),
  deadline_type: z.enum(["standard", "extended", "custom"]).default("standard"),
  notes: z.string().optional(),
  has_rental_income: z.boolean().default(false),
  has_capital_gains: z.boolean().default(false),
  has_foreign_income: z.boolean().default(false),
  has_depreciation: z.boolean().default(false),
  has_exempt_rental: z.boolean().default(false),
});

// ── Report Detail ──────────────────────────────────────────────────────────

export const annualReportDetailSchema = z.object({
  tax_refund_amount: z.string().trim().optional().or(z.literal("")),
  tax_due_amount: z.string().trim().optional().or(z.literal("")),
  client_approved_at: z.string().trim().optional().or(z.literal("")),
  internal_notes: z.string().trim().optional().or(z.literal("")),
});

export type AnnualReportDetailFormValues = z.infer<typeof annualReportDetailSchema>;

export const annualReportDetailDefaults: AnnualReportDetailFormValues = {
  tax_refund_amount: "",
  tax_due_amount: "",
  client_approved_at: "",
  internal_notes: "",
};