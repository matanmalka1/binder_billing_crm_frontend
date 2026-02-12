import type { ChargeResponse } from "../../../api/charges.api";

export const getChargeAmountText = (charge: ChargeResponse): string => {
  if (!("amount" in charge) || typeof charge.amount !== "number") return "—";
  return `${charge.amount.toFixed(2)} ${charge.currency}`;
};
