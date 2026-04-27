import { formatCompactCurrencyILS, MONTH_NAMES } from "../../utils/utils";
import type { ChargeResponse } from "./api";
export { CHARGE_TYPE_LABELS, getChargeTypeLabel } from "../../utils/enums";

export const canIssue = (status: string): boolean => status === "draft";

export const canMarkPaid = (status: string): boolean => status === "issued";

export const canCancel = (status: string): boolean =>
  status === "draft" || status === "issued";

const PERIOD_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

export const getChargePeriodLabel = (
  period: string | null,
  monthsCovered: number | null,
): string => {
  if (!period) return "—";

  const match = PERIOD_PATTERN.exec(period);
  if (!match) return period;

  const startYear = Number(match[1]);
  const startMonthIndex = Number(match[2]) - 1;
  const coverage = monthsCovered === 2 ? 2 : 1;
  const startLabel = MONTH_NAMES[startMonthIndex];

  if (coverage === 1) {
    return `${startLabel} ${startYear}`;
  }

  const endDate = new Date(startYear, startMonthIndex + coverage - 1, 1);
  const endLabel = MONTH_NAMES[endDate.getMonth()];
  const endYear = endDate.getFullYear();

  if (endYear === startYear) {
    return `${startLabel}-${endLabel} ${startYear}`;
  }

  return `${startLabel} ${startYear} - ${endLabel} ${endYear}`;
};

export const getChargeAmountText = (charge: ChargeResponse): string => {
  if (!charge.amount) return "—";
  return formatCompactCurrencyILS(charge.amount);
};

export const formatILS = (amount: number): string =>
  formatCompactCurrencyILS(amount);
