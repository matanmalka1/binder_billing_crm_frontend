export const DOC_TYPE_LABELS: Record<string, string> = {
  id_copy: "צילום ת.ז.",
  power_of_attorney: "ייפוי כוח",
  engagement_agreement: "הסכם התקשרות",
  tax_form: "טופס מס",
  receipt: "קבלה",
  invoice_doc: "חשבונית",
  bank_approval: "אישור בנק",
  withholding_certificate: "אישור ניכוי מס",
  nii_approval: "אישור ביטוח לאומי",
  other: "אחר",
};

export const STATUS_LABELS: Record<string, string> = {
  pending: "ממתין",
  received: "התקבל",
  approved: "אושר",
  rejected: "נדחה",
};

export const STATUS_BADGE_VARIANT: Record<
  string,
  "neutral" | "info" | "success" | "error"
> = {
  pending: "neutral",
  received: "info",
  approved: "success",
  rejected: "error",
};
