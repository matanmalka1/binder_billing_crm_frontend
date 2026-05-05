import {
  getChargeStatusLabel,
  CHARGE_TYPE_LABELS,
  CHARGE_STATUS_VARIANTS as chargeStatusVariants,
} from '../../utils/enums'
import { ALL_STATUSES_OPTION, ALL_TYPES_OPTION } from '@/constants/filterOptions.constants'
import type { ChargeListStats, ChargeStatusStat } from './api'

export { CHARGE_TYPE_LABELS, chargeStatusVariants }

export const CHARGE_CREATE_FORM_ID = 'charges-create-form'
export const CHARGE_CANCEL_REASON_PLACEHOLDER = 'סיבת ביטול (אופציונלי)'
export const CHARGE_PERIOD_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/
export const CHARGE_PERIOD_YEAR_SPAN = 1

export const CHARGE_TYPE_VALUES = [
  'monthly_retainer',
  'annual_report_fee',
  'vat_filing_fee',
  'representation_fee',
  'consultation_fee',
  'other',
] as const

export const CHARGE_STATUSES = ['draft', 'issued', 'paid', 'canceled'] as const

export const DEFAULT_CHARGE_STATUS_STAT: ChargeStatusStat = { count: 0, amount: '0' }

export const DEFAULT_CHARGE_LIST_STATS: ChargeListStats = {
  draft: DEFAULT_CHARGE_STATUS_STAT,
  issued: DEFAULT_CHARGE_STATUS_STAT,
  paid: DEFAULT_CHARGE_STATUS_STAT,
  canceled: DEFAULT_CHARGE_STATUS_STAT,
}

export const CHARGE_STATUS_OPTIONS: { value: string; label: string }[] = [
  ALL_STATUSES_OPTION,
  ...CHARGE_STATUSES.map((status) => ({
    value: status,
    label: getChargeStatusLabel(status),
  })),
]

export const CHARGE_TYPE_OPTIONS: { value: string; label: string }[] = Object.entries(CHARGE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
)

export const CHARGE_TYPE_OPTIONS_WITH_ALL: { value: string; label: string }[] = [
  ALL_TYPES_OPTION,
  ...CHARGE_TYPE_OPTIONS,
]
