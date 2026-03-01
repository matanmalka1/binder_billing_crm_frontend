import { differenceInCalendarDays, parseISO } from "date-fns";
import type { StageKey } from "./types";

export const STAGE_ACCENT: Record<StageKey, string> = {
  material_collection: "from-gray-400 to-gray-500",
  in_progress: "from-blue-400 to-blue-500",
  final_review: "from-purple-400 to-purple-500",
  client_signature: "from-orange-400 to-orange-500",
  transmitted: "from-green-400 to-green-500",
};

export const TERMINAL_STATUSES = new Set(["submitted", "accepted", "closed"]);

export const daysUntil = (dateStr: string | null): number | null => {
  if (!dateStr) return null;
  return differenceInCalendarDays(parseISO(dateStr), new Date());
};

type FlagFieldName =
  | "has_rental_income"
  | "has_capital_gains"
  | "has_foreign_income"
  | "has_depreciation"
  | "has_exempt_rental";

export const FLAG_FIELDS: { name: FlagFieldName; label: string }[] = [
  { name: "has_rental_income", label: 'הכנסת שכירות (נספח ב)' },
  { name: "has_capital_gains", label: "רווחי הון (נספח בית)" },
  { name: "has_foreign_income", label: 'הכנסות מחו"ל (נספח ג)' },
  { name: "has_depreciation", label: "פחת (נספח ד)" },
  { name: "has_exempt_rental", label: "שכר דירה פטור (נספח ה)" },
];

export interface TransitionForm {
  note: string;
  itaRef: string;
  assessmentAmount: string;
  refundDue: string;
  taxDue: string;
}

export const EMPTY_FORM: TransitionForm = {
  note: "",
  itaRef: "",
  assessmentAmount: "",
  refundDue: "",
  taxDue: "",
};
