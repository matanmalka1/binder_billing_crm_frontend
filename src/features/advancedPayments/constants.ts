import { getAdvancePaymentStatusLabel } from '../../utils/enums'
import { MONTHS_COVERED_OPTIONS } from '@/constants/periodOptions.constants'
import { ALL_STATUSES_OPTION, ALL_MONTHS_OPTION } from '@/constants/filterOptions.constants'
import type { AdvancePaymentStatus } from './types'
import { MONTH_OPTIONS } from './utils'

export const ADVANCE_PAYMENT_STATUS_FILTERS: AdvancePaymentStatus[] = [
  'pending',
  'paid',
  'partial',
  'overdue',
]

export const ADVANCE_PAYMENT_STATUS_OPTIONS: { value: AdvancePaymentStatus; label: string }[] =
  ADVANCE_PAYMENT_STATUS_FILTERS.map((status) => ({
    value: status,
    label: getAdvancePaymentStatusLabel(status),
  }))

export const ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL: {
  value: AdvancePaymentStatus | ''
  label: string
}[] = [
  ALL_STATUSES_OPTION,
  { value: 'overdue', label: getAdvancePaymentStatusLabel('overdue') },
  { value: 'pending', label: getAdvancePaymentStatusLabel('pending') },
  { value: 'partial', label: getAdvancePaymentStatusLabel('partial') },
  { value: 'paid', label: getAdvancePaymentStatusLabel('paid') },
]

export const ADVANCE_PAYMENT_MONTH_FILTER_OPTIONS = [ALL_MONTHS_OPTION, ...MONTH_OPTIONS]

export { PAGE_SIZE_MD as PAGE_SIZE } from '@/constants/pagination.constants'

export const ADVANCE_PAYMENT_FREQUENCY_OPTIONS = MONTHS_COVERED_OPTIONS
