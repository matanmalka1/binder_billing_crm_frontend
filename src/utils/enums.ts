import { makeLabelGetter } from "./labels";

export const getStatusLabel = makeLabelGetter({
  in_office: "במשרד",
  ready_for_pickup: "מוכן לאיסוף",
  returned: "הוחזר",
});

export const getClientTypeLabel = makeLabelGetter({
  osek_patur: "עוסק פטור",
  osek_murshe: "עוסק מורשה",
  company: "חברה",
  employee: "שכיר",
});

export const getClientStatusLabel = makeLabelGetter({
  active: "פעיל",
  frozen: "מוקפא",
  closed: "סגור",
});

export const getChargeStatusLabel = makeLabelGetter({
  draft: "טיוטה",
  issued: "הונפק",
  paid: "שולם",
  canceled: "בוטל",
});

export const getAdvancePaymentStatusLabel = makeLabelGetter({
  pending: "ממתין",
  paid: "שולם",
  partial: "חלקי",
  overdue: "באיחור",
});

export const getRoleLabel = makeLabelGetter({
  advisor: "יועץ",
  secretary: "מזכירה",
});


export const getBinderTypeLabel = makeLabelGetter({
  vat: 'מע"מ',
  income_tax: "מס הכנסה",
  national_insurance: "ביטוח לאומי",
  capital_declaration: "הצהרת הון",
  annual_report: "דוח שנתי",
  salary: "שכר",
  bookkeeping: "הנהלת חשבונות",
  other: "אחר",
});

export const getSignatureRequestStatusLabel = makeLabelGetter({
  draft: 'טיוטה',
  pending_signature: 'ממתין לחתימה',
  signed: 'נחתם',
  declined: 'נדחה',
  expired: 'פג תוקף',
  canceled: 'בוטל',
});

export const getSignatureRequestTypeLabel = makeLabelGetter({
  engagement_agreement: 'הסכם התקשרות',
  annual_report_approval: 'אישור דוח שנתי',
  power_of_attorney: 'ייפוי כוח',
  vat_return_approval: 'אישור דוח מע"מ',
  custom: 'מותאם אישית',
});

export const getVatRateTypeLabel = makeLabelGetter({
  standard: 'חייב במע"מ',
  exempt: "פטור",
  zero_rate: "אפס",
});

export const getDocumentTypeLabel = makeLabelGetter({
  tax_invoice: "חשבונית מס",
  transaction_invoice: "חשבונית עסקה",
  receipt: "קבלה",
  consolidated: "חשבונית מרוכזת",
  self_invoice: "חשבונית עצמית",
});

export const getVatWorkItemStatusLabel = makeLabelGetter({
  pending_materials: "ממתין לחומרים",
  material_received: "חומרים התקבלו",
  data_entry_in_progress: "הקלדה בתהליך",
  ready_for_review: "ממתין לבדיקה",
  filed: "הוגש",
});
