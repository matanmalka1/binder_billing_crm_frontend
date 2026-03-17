export const ACTION_LABELS: Record<string, string> = {
  material_received: "קבלת חומרים",
  status_changed: "שינוי סטטוס",
  invoice_added: "חשבונית נוספה",
  invoice_updated: "חשבונית עודכנה",
  invoice_deleted: "חשבונית נמחקה",
  vat_override: 'עקיפת סכום מע"מ',
  vat_calculated: 'חישוב מע"מ',
  filed: "הוגש",
};

export const INVOICE_TYPE_LABELS: Record<string, string> = {
  income: "הכנסה",
  expense: "הוצאה",
};

export const AUTO_TRANSITION_NOTE = "Auto-transitioned on first invoice entry";

export const PAGE_SIZE = 20;
