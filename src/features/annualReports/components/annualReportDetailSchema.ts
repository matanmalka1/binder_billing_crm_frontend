import { z } from "zod";

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
