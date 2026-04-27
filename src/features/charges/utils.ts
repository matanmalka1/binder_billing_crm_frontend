import { formatCompactCurrencyILS, MONTH_NAMES } from "../../utils/utils";
import type { ChargeResponse } from "./api";
import { CHARGE_PERIOD_PATTERN } from "./constants";
import type { ChargeAction } from "./types";
export { CHARGE_TYPE_LABELS, getChargeTypeLabel } from "../../utils/enums";

const ACTION_ALLOWED_STATUSES: Record<ChargeAction, Set<string>> = {
  issue: new Set(["draft"]),
  markPaid: new Set(["issued"]),
  cancel: new Set(["draft", "issued"]),
};

export const canRunChargeAction = (
  status: string,
  action: ChargeAction,
): boolean => ACTION_ALLOWED_STATUSES[action].has(status);

export const canIssue = (status: string): boolean =>
  canRunChargeAction(status, "issue");

export const canMarkPaid = (status: string): boolean =>
  canRunChargeAction(status, "markPaid");

export const canCancel = (status: string): boolean =>
  canRunChargeAction(status, "cancel");

export const getChargePeriodLabel = (
  period: string | null,
  monthsCovered: number | null,
): string => {
  if (!period) return "—";

  const match = CHARGE_PERIOD_PATTERN.exec(period);
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

export const getChargeClientLabel = (charge: ChargeResponse): string =>
  charge.business_name ?? `לקוח #${charge.client_record_id}`;
