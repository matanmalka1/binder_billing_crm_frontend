import { buildYearOptions } from "../../utils/utils";

export const fmtCurrency = (n: number | null): string =>
  n != null
    ? `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 0 })}`
    : "—";

export const MONTH_NAMES = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
] as const;

export const MONTH_OPTIONS = MONTH_NAMES.map((label, index) => ({
  value: String(index + 1),
  label,
}));

export const YEAR_OPTIONS = buildYearOptions();
