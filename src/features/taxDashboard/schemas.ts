import { z } from "zod";

export const TaxSubmissionWidgetResponseSchema = z.object({
  tax_year: z.number(),
  total_clients: z.number(),
  reports_submitted: z.number(),
  reports_in_progress: z.number(),
  reports_not_started: z.number(),
  submission_percentage: z.number(),
  total_refund_due: z.number(),
  total_tax_due: z.number(),
});
