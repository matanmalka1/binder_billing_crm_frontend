import { z } from 'zod'
import { CORRESPONDENCE_TYPES } from './constants'

export const correspondenceSchema = z.object({
  correspondence_type: z.enum(CORRESPONDENCE_TYPES),
  subject: z.string().trim().min(1, 'יש להזין נושא'),
  notes: z.string().trim().optional().or(z.literal('')),
  occurred_at: z.string().trim().min(1, 'יש להזין תאריך'),
  contact_id: z.number().nullable().optional(),
})

export type CorrespondenceFormValues = z.infer<typeof correspondenceSchema>
