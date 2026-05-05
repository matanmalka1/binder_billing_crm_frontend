export const TAX_SUBMISSION_FILTERS = {
  all: '',
  submitted: 'completed',
  inProgress: 'pending',
} as const

export type TaxSubmissionFilter = (typeof TAX_SUBMISSION_FILTERS)[keyof typeof TAX_SUBMISSION_FILTERS]

export const TAX_SUBMISSION_STAT_TITLES = {
  total: 'סה"כ לקוחות',
  submitted: 'דוחות שהוגשו',
  inProgress: 'בתהליך עבודה',
  notStarted: 'טרם התחילו',
  completion: 'אחוז השלמה',
  refund: 'החזרי מס',
  taxDue: 'תשלומי מס',
} as const
