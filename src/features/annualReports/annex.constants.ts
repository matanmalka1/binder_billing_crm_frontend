import type { AnnualReportScheduleKey } from "./api";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "number" | "date";
};

export const SCHEDULE_FIELDS: Record<AnnualReportScheduleKey, FieldDef[]> = {
  schedule_a: [
    { key: "business_income", label: "הכנסה מעסק", type: "number" },
    { key: "business_expenses", label: "הוצאות עסק", type: "number" },
    { key: "net_business_income", label: "הכנסה נטו מעסק", type: "number" },
  ],
  schedule_b: [
    { key: "property_address", label: "כתובת הנכס", type: "text" },
    { key: "rental_income", label: "הכנסה משכירות", type: "number" },
  ],
  schedule_bet: [
    { key: "asset_description", label: "תיאור הנכס", type: "text" },
    { key: "purchase_date", label: "תאריך רכישה", type: "date" },
    { key: "sale_date", label: "תאריך מכירה", type: "date" },
    { key: "purchase_price", label: "מחיר רכישה", type: "number" },
    { key: "sale_price", label: "מחיר מכירה", type: "number" },
    { key: "exempt_amount", label: "סכום פטור", type: "number" },
    { key: "taxable_gain", label: "רווח חייב", type: "number" },
  ],
  schedule_gimmel: [
    { key: "country", label: "מדינה", type: "text" },
    { key: "income_type", label: "סוג הכנסה", type: "text" },
    { key: "gross_amount", label: "סכום ברוטו", type: "number" },
    { key: "foreign_tax_paid", label: "מס זר ששולם", type: "number" },
    { key: "credit_claimed", label: "זיכוי נדרש", type: "number" },
  ],
  schedule_dalet: [
    { key: "asset_name", label: "שם הנכס", type: "text" },
    { key: "purchase_date", label: "תאריך רכישה", type: "date" },
    { key: "cost", label: "עלות", type: "number" },
    { key: "depreciation_rate", label: "שיעור פחת (%)", type: "number" },
    { key: "annual_depreciation", label: "פחת שנתי", type: "number" },
    { key: "accumulated", label: "פחת מצטבר", type: "number" },
  ],
  schedule_heh: [
    { key: "property_address", label: "כתובת הנכס", type: "text" },
    { key: "monthly_rent", label: "שכירות חודשית", type: "number" },
    { key: "annual_rent", label: "שכירות שנתית", type: "number" },
    { key: "exempt_ceiling", label: "תקרת פטור", type: "number" },
    { key: "taxable_portion", label: "חלק חייב", type: "number" },
  ],
  schedule_vav: [
    { key: "security_name", label: "שם הנייר", type: "text" },
    { key: "purchase_date", label: "תאריך רכישה", type: "date" },
    { key: "sale_date", label: "תאריך מכירה", type: "date" },
    { key: "purchase_price", label: "מחיר רכישה", type: "number" },
    { key: "sale_price", label: "מחיר מכירה", type: "number" },
    { key: "taxable_gain", label: "רווח חייב", type: "number" },
  ],
  annex_15: [
    { key: "country", label: "מדינה", type: "text" },
    { key: "income_type", label: "סוג הכנסה", type: "text" },
    { key: "gross_amount", label: "סכום ברוטו", type: "number" },
    { key: "foreign_tax_paid", label: "מס זר ששולם", type: "number" },
    { key: "credit_claimed", label: "זיכוי נדרש", type: "number" },
  ], // same fields as schedule_gimmel — both report foreign income; annex_15 is for the tax credit claim
  annex_867: [
    { key: "bank_name", label: "שם הבנק", type: "text" },
    { key: "account_number", label: "מספר חשבון", type: "text" },
    { key: "interest_income", label: "הכנסות ריבית", type: "number" },
    { key: "dividend_income", label: "הכנסות דיבידנד", type: "number" },
    { key: "tax_withheld", label: "מס שנוכה במקור", type: "number" },
  ],
};

export const ALL_SCHEDULES: AnnualReportScheduleKey[] = [
  "schedule_a",
  "schedule_b",
  "schedule_bet",
  "schedule_gimmel",
  "schedule_dalet",
  "schedule_heh",
  "schedule_vav",
  "annex_15",
  "annex_867",
];

export const buildEmptyForm = (
  schedule: AnnualReportScheduleKey,
): Record<string, string> =>
  Object.fromEntries(SCHEDULE_FIELDS[schedule].map((field) => [field.key, ""]));

export const mapLineDataToForm = (
  schedule: AnnualReportScheduleKey,
  data: Record<string, unknown>,
): Record<string, string> =>
  Object.fromEntries(
    SCHEDULE_FIELDS[schedule].map((field) => [
      field.key,
      String(data[field.key] ?? ""),
    ]),
  );

export const buildAnnexPayload = (
  schedule: AnnualReportScheduleKey,
  formData: Record<string, string>,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};
  for (const field of SCHEDULE_FIELDS[schedule]) {
    payload[field.key] =
      field.type === "number"
        ? parseFloat(formData[field.key] || "0")
        : formData[field.key];
  }
  return payload;
};
