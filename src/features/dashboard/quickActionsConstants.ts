import type { ActionMethod } from "@/lib/actions/types";

export const QUICK_ACTION_CATEGORY_LABELS: Record<string, string> = {
  binders: "קלסרים",
  vat: 'מע"מ',
  annual_reports: 'דו"חות שנתיים',
};

export const QUICK_ACTION_CATEGORY_ORDER = [
  "binders",
  "vat",
  "annual_reports",
] as const;

export const QUICK_ACTION_EFFECT_LABELS: Record<ActionMethod, string> = {
  get: "פתיחת פריט",
  post: "שינוי סטטוס",
  patch: "שינוי סטטוס",
  put: "עדכון פריט",
  delete: "מחיקת פריט",
};

export const QUICK_ACTION_EFFECT_DESCRIPTIONS: Record<ActionMethod, string> = {
  get: "פותח את הפריט הרלוונטי ללא שינוי נתונים",
  post: "מבצע פעולה במערכת ועשוי לשנות סטטוס",
  patch: "מעדכן את הפריט ועשוי לשנות סטטוס",
  put: "מעדכן את הפריט ועשוי לשנות נתונים",
  delete: "מוחק או מבטל פריט לאחר אישור",
};

export const QUICK_ACTION_COPY = {
  title: "פעולות מהירות",
  emptyTitle: "הכל מטופל!",
  emptyDescription: "אין פעולות ממתינות כרגע",
  noActions: "אין פעולות ממתינות",
  loading: "מבצע פעולה...",
  requiresConfirmation: "דורש אישור",
  fallbackCategory: "כללי",
  fallbackEffect: "פעולה",
  fallbackEffectDescription: "מבצע פעולה במערכת",
  footerHint:
    'תג "פתיחת פריט" רק מנווט לפריט. תגי שינוי/עדכון מבצעים פעולה במערכת, ופעולות המסומנות "דורש אישור" יציגו חלון אישור לפני הביצוע.',
} as const;

export const QUICK_ACTION_ENTER_DELAY_MS = 50;
