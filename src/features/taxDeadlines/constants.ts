import { TAX_DEADLINE_TYPE_LABELS, getDeadlineTypeLabel } from '../../utils/enums'
import { ALL_STATUSES_OPTION, ALL_TYPES_OPTION } from '@/constants/filterOptions.constants'
import type { TimelineFilters } from './types'

export { getDeadlineTypeLabel as getTaxDeadlineTypeLabel }

export const TAX_DEADLINE_CREATE_FORM_ID = 'tax-deadline-create-form'
export const EDIT_TAX_DEADLINE_FORM_ID = 'edit-tax-deadline-form'
export const GENERATE_TAX_DEADLINES_FORM_ID = 'generate-tax-deadlines-form'
export const REQUIRED_FIELD_MESSAGE = 'שדה חובה'
export const DUPLICATE_TAX_DEADLINE_MESSAGE = 'קיים כבר מועד פעיל לאותו לקוח, סוג ותקופה'

export const CLIENT_DEADLINES_PAGE_SIZE = 100

export const INITIAL_TIMELINE_FILTERS: TimelineFilters = {
  status: '',
  type: '',
  year: '',
  overdueOnly: false,
}

export const HEBREW_MONTHS = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
]

export const HEBREW_SHORT_MONTHS = [
  'ינו׳',
  'פבר׳',
  'מרץ',
  'אפר׳',
  'מאי',
  'יוני',
  'יולי',
  'אוג׳',
  'ספט׳',
  'אוק׳',
  'נוב׳',
  'דצמ׳',
]

export const TAX_DEADLINE_TYPE_OPTIONS = Object.entries(TAX_DEADLINE_TYPE_LABELS)
  .filter(([value]) => value !== '')
  .map(([value, label]) => ({ value, label }))

export const TAX_DEADLINE_FILTER_TYPE_OPTIONS = [ALL_TYPES_OPTION, ...TAX_DEADLINE_TYPE_OPTIONS]

export const TAX_DEADLINE_STATUS_OPTIONS = [
  ALL_STATUSES_OPTION,
  { value: 'pending', label: 'ממתין' },
  { value: 'completed', label: 'הושלם' },
  { value: 'canceled', label: 'בוטל' },
]

export const getTaxDeadlineStatusLabel = (value: string) =>
  TAX_DEADLINE_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value
