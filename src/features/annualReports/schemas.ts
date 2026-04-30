import { z } from 'zod'

// ── Create Report ──────────────────────────────────────────────────────────

export const createReportSchema = z.object({
  client_id: z.string().min(1, 'שדה חובה'),
  tax_year: z.string().min(4, 'שנה לא תקינה'),
  client_type: z.enum([
    'individual',
    'self_employed',
    'corporation',
    'public_institution',
    'partnership',
    'control_holder',
    'exempt_dealer',
  ]),
  deadline_type: z.enum(['standard', 'extended', 'custom']).default('standard'),
  submission_method: z.enum(['online', 'manual', 'representative']).optional(),
  extension_reason: z
    .enum(['military_service', 'health_reason', 'general', 'war_situation'])
    .optional(),
  notes: z.string().optional(),
  has_rental_income: z.boolean().default(false),
  has_capital_gains: z.boolean().default(false),
  has_foreign_income: z.boolean().default(false),
  has_depreciation: z.boolean().default(false),
  // Pre-fill fields — NOT sent to API; used for client-side preview only
  gross_income: z.string().optional(),
  expenses: z.string().optional(),
  advances_paid: z.string().optional(),
  credit_points: z.string().optional(),
})

export type CreateReportFormValues = z.input<typeof createReportSchema>

// ── Report Detail ──────────────────────────────────────────────────────────

export const annualReportDetailSchema = z.object({
  client_approved_at: z.string().trim().optional().or(z.literal('')),
  internal_notes: z.string().trim().optional().or(z.literal('')),
})

export type AnnualReportDetailFormValues = z.infer<typeof annualReportDetailSchema>

export const annualReportDetailDefaults: AnnualReportDetailFormValues = {
  client_approved_at: '',
  internal_notes: '',
}
