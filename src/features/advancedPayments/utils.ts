import {
  getReportingPeriodMonthLabel,
  getReportingPeriodShortMonthLabel,
  MONTH_NAMES,
  PERIOD_YEAR_OPTIONS,
} from '@/constants/periodOptions.constants'

export { fmtCurrency, MONTH_OPTIONS } from '../../utils/utils'
export { MONTH_NAMES }

export { ADVANCE_PAYMENT_STATUS_VARIANTS as STATUS_VARIANT } from '../../utils/enums'

export { MONTH_SHORT_NAMES } from '@/constants/periodOptions.constants'

export const YEAR_OPTIONS = PERIOD_YEAR_OPTIONS

export const getAdvancePaymentMonthLabel = (period: string, periodMonthsCount: 1 | 2 = 1) =>
  getReportingPeriodMonthLabel(period, periodMonthsCount)

export const getAdvancePaymentShortMonthLabel = (period: string, periodMonthsCount: 1 | 2 = 1) =>
  getReportingPeriodShortMonthLabel(period, periodMonthsCount)
