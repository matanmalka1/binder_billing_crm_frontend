import type { IncomeSourceType, ExpenseCategoryType } from "../../api/annualReports.api";

export { LineRow } from "./components/FinancialLineRow";
export type { LineRowProps } from "./components/FinancialLineRow";

export const INCOME_LABELS: Record<IncomeSourceType, string> = {
  business: "הכנסות עסק",
  salary: "משכורת",
  interest: "ריבית",
  dividends: "דיבידנד",
  capital_gains: "רווחי הון",
  rental: "שכירות",
  foreign: 'הכנסות מחו"ל',
  pension: "פנסיה / קצבה",
  other: "אחר",
};

export const EXPENSE_LABELS: Record<ExpenseCategoryType, string> = {
  office_rent: "שכירות משרד",
  professional_services: "שירותים מקצועיים",
  salaries: "שכר עבודה",
  depreciation: "פחת",
  vehicle: "רכב",
  marketing: "שיווק ופרסום",
  insurance: "ביטוח",
  communication: "תקשורת",
  travel: "נסיעות",
  training: "הכשרה מקצועית",
  bank_fees: "עמלות בנק",
  other: "אחר",
};
