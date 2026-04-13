import { buildYearOptions, getReportingPeriodMonthLabel, MONTH_NAMES } from "../../utils/utils";

export { fmtCurrency, MONTH_OPTIONS } from "../../utils/utils";
export { MONTH_NAMES };

export { ADVANCE_PAYMENT_STATUS_VARIANTS as STATUS_VARIANT } from "../../utils/enums";

export const MONTH_SHORT_NAMES = [
  "ינו",
  "פבר",
  "מרץ",
  "אפר",
  "מאי",
  "יונ",
  "יול",
  "אוג",
  "ספט",
  "אוק",
  "נוב",
  "דצמ",
] as const;

export const YEAR_OPTIONS = buildYearOptions();

export const getAdvancePaymentMonthLabel = (period: string, periodMonthsCount: 1 | 2 = 1) =>
  getReportingPeriodMonthLabel(period, periodMonthsCount);

export const getAdvancePaymentShortMonthLabel = (period: string, periodMonthsCount: 1 | 2 = 1) => {
  const month = Number(period.split("-")[1]);
  const monthIndex = Number.isInteger(month) && month >= 1 && month <= 12 ? month - 1 : null;
  if (monthIndex === null) return period;
  if (periodMonthsCount === 1) return MONTH_SHORT_NAMES[monthIndex];

  const endMonthIndex = monthIndex + periodMonthsCount - 1;
  if (endMonthIndex >= MONTH_SHORT_NAMES.length) return period;
  return `${MONTH_SHORT_NAMES[monthIndex]}-${MONTH_SHORT_NAMES[endMonthIndex]}`;
};
