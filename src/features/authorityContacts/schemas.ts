import { z } from 'zod'
import { AUTHORITY_CONTACT_TYPE_VALUES } from './api'

export const authorityContactSchema = z.object({
  contact_type: z.enum(AUTHORITY_CONTACT_TYPE_VALUES),
  name: z.string().trim().min(1, 'יש להזין שם'),
  office: z.string().trim().optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  email: z.string().trim().email('כתובת אימייל לא תקינה').optional().or(z.literal('')),
  notes: z.string().trim().optional().or(z.literal('')),
})

export type AuthorityContactFormValues = z.infer<typeof authorityContactSchema>

export const authorityContactDefaults: AuthorityContactFormValues = {
  contact_type: AUTHORITY_CONTACT_TYPE_VALUES[0],
  name: '',
  office: '',
  phone: '',
  email: '',
  notes: '',
}
