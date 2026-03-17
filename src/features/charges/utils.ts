import type { ChargeResponse } from "../../api/charges.api";

export const CHARGE_TYPE_LABELS: Record<string, string> = {
  one_time: "חד פעמי",
  retainer: "ריטיינר",
  hourly: "שעתי",
};

export const canIssue = (status: string): boolean => status === "draft";

export const canMarkPaid = (status: string): boolean => status === "issued";

export const canCancel = (status: string): boolean =>
  status === "draft" || status === "issued";

export const getChargeAmountText = (charge: ChargeResponse): string => {
  if (!("amount" in charge) || typeof charge.amount !== "number") return "—";
  return charge.amount.toLocaleString("he-IL", {
    style: "currency",
    currency: charge.currency ?? "ILS",
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
