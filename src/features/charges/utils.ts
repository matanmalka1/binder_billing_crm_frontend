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
