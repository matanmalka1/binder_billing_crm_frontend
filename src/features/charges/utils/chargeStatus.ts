import type { ChargeResponse } from "../../../api/charges.api";

export const canIssue = (status: string): boolean => status === "draft";

export const canMarkPaid = (status: string): boolean => status === "issued";

export const canCancel = (status: string): boolean =>
  status === "draft" || status === "issued";

export const getChargeAmountText = (charge: ChargeResponse): string => {
  if (!("amount" in charge) || typeof charge.amount !== "number") return "—";
  return `${charge.amount.toFixed(2)} ${charge.currency}`;
};
