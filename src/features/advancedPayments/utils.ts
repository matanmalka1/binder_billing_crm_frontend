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
