import { MONTH_NAMES } from "../../utils/utils";
import type { ChargeResponse } from "./api";

export const CHARGE_TYPE_LABELS: Record<string, string> = {
  monthly_retainer: "ריטיינר חודשי",
  annual_report_fee: "שכר טרחה לדוח שנתי",
  vat_filing_fee: "שכר טרחה לדוח מע״מ",
  representation_fee: "שכר טרחה לייצוג",
  consultation_fee: "שכר טרחה לייעוץ",
  other: "אחר",
};

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
  const amount = Number(charge.amount);
  if (Number.isNaN(amount)) return "—";
  return amount.toLocaleString("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/\s/g, "");
};

export const formatILS = (amount: number): string =>
  amount.toLocaleString("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(/\s/g, "");

export const getChargeTypeLabel = (type: string): string =>
  CHARGE_TYPE_LABELS[type] ?? type;
