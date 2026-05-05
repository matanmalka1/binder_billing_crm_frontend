import type { TaxProfileData } from './api'

export const TAX_PROFILE_FORM_ID = 'tax-profile-form'
export const EMPTY_TAX_PROFILE_VALUE = '—'

export const TAX_PROFILE_TEXT = {
  title: 'פרטי מס',
  subtitle: 'מידע מיסויי ספציפי ללקוח',
  editTitle: 'עריכת פרטי מס',
  loading: 'טוען פרטי מס...',
  edit: 'עריכה',
  cancel: 'ביטול',
  save: 'שמור',
  saveChanges: 'שמור שינויים',
  advisorUnset: 'לא הוגדר',
  advisorsLoading: 'טוען רואי חשבון...',
} as const

export const TAX_PROFILE_FIELD_LABELS = {
  vatReportingFrequency: 'תדירות דיווח מע"מ',
  accountant: 'רואה חשבון מלווה',
  advanceRate: 'אחוז מקדמה',
  advanceRateInput: 'אחוז מקדמה (%)',
} as const

export const VAT_REPORTING_FREQUENCIES = ['monthly', 'bimonthly', 'exempt'] as const satisfies readonly NonNullable<
  TaxProfileData['vat_reporting_frequency']
>[]

export const ADVANCE_RATE_INPUT = {
  min: 0,
  max: 100,
  step: 0.01,
} as const
