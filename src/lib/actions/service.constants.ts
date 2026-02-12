import type { CanonicalActionToken } from "./types";

export const TOKEN_ALIASES: Record<string, CanonicalActionToken> = {
  receive: "receive",
  receive_binder: "receive",
  ready: "ready",
  ready_binder: "ready",
  return: "return",
  return_binder: "return",
  freeze: "freeze",
  activate: "activate",
  mark_paid: "mark_paid",
  pay_charge: "mark_paid",
  mark_charge_paid: "mark_paid",
  issue_charge: "issue_charge",
  cancel_charge: "cancel_charge",
};

export const ACTION_LABELS: Record<CanonicalActionToken, string> = {
  receive: "קליטת תיק",
  ready: "מוכן לאיסוף",
  return: "החזרת תיק",
  freeze: "הקפאת לקוח",
  activate: "הפעלת לקוח",
  mark_paid: "סימון חיוב כשולם",
  issue_charge: "הנפקת חיוב",
  cancel_charge: "ביטול חיוב",
};

export const ADVISOR_ONLY_ACTIONS = new Set<CanonicalActionToken>([
  "freeze",
  "mark_paid",
  "issue_charge",
  "cancel_charge",
]);
