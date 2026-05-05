export const MONTHS_COVERED_OPTIONS = [
  { value: '1', label: 'חודשי' },
  { value: '2', label: 'דו-חודשי' },
]

export const BIMONTHLY_START_MONTH_VALUES = new Set(['1', '3', '5', '7', '9', '11'])

export const MONTH_NAMES = [
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
] as const

export const MONTH_SHORT_NAMES = [
  'ינו',
  'פבר',
  'מרץ',
  'אפר',
  'מאי',
  'יונ',
  'יול',
  'אוג',
  'ספט',
  'אוק',
  'נוב',
  'דצמ',
] as const

export const MONTH_OPTIONS = MONTH_NAMES.map((label, index) => ({
  value: String(index + 1),
  label,
}))

export const NUMERIC_MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1).padStart(2, '0'),
}))

export const buildYearOptions = (from = 2000): { value: string; label: string }[] => {
  const end = new Date().getFullYear() + 1
  return Array.from({ length: end - from + 1 }, (_, i) => ({
    value: String(end - i),
    label: String(end - i),
  }))
}

/** Last 5 years descending, for year-filter dropdowns. */
export const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
  value: String(new Date().getFullYear() - i),
  label: String(new Date().getFullYear() - i),
}))

export const PERIOD_YEAR_OPTIONS = buildYearOptions()

/** Oct+ → next year; else current year. */
export const getOperationalTaxYear = (): number => {
  const now = new Date()
  return now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear()
}

/** 7 years descending from operational tax year. */
export const getOperationalYearOptions = (count = 7): { value: string; label: string }[] => {
  const top = getOperationalTaxYear()
  return Array.from({ length: count }, (_, i) => ({
    value: String(top - i),
    label: String(top - i),
  }))
}

/** current year - 1: the most recent completed tax year. */
export const getActiveReportTaxYear = (): number => new Date().getFullYear() - 1

/** 7 years descending from active report tax year. */
export const getActiveReportYearOptions = (count = 7): { value: string; label: string }[] => {
  const top = getActiveReportTaxYear()
  return Array.from({ length: count }, (_, i) => ({
    value: String(top - i),
    label: String(top - i),
  }))
}

const getPeriodLabel = (
  names: typeof MONTH_NAMES | typeof MONTH_SHORT_NAMES,
  period: string,
  periodMonthsCount: 1 | 2,
): string => {
  const month = Number(period.split('-')[1])
  const monthIndex = Number.isInteger(month) && month >= 1 && month <= 12 ? month - 1 : null
  if (monthIndex === null) return period
  if (periodMonthsCount === 1) return names[monthIndex]
  const endMonthIndex = monthIndex + periodMonthsCount - 1
  if (endMonthIndex >= names.length) return period
  return `${names[monthIndex]}-${names[endMonthIndex]}`
}

export const getReportingPeriodMonthLabel = (period: string, periodMonthsCount: 1 | 2 = 1): string =>
  getPeriodLabel(MONTH_NAMES, period, periodMonthsCount)

export const getReportingPeriodShortMonthLabel = (period: string, periodMonthsCount: 1 | 2 = 1): string =>
  getPeriodLabel(MONTH_SHORT_NAMES, period, periodMonthsCount)
