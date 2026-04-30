import { z } from 'zod'

export const taxProfileSchema = z.object({
  vat_reporting_frequency: z.enum(['monthly', 'bimonthly', 'exempt']),
  accountant_id: z.string().trim().optional().or(z.literal('')),
  advance_rate: z.string().trim().optional().or(z.literal('')),
})

export type TaxProfileFormValues = z.infer<typeof taxProfileSchema>

export const taxProfileDefaults: TaxProfileFormValues = {
  vat_reporting_frequency: 'monthly',
  accountant_id: '',
  advance_rate: '',
}
