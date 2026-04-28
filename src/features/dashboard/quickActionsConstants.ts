import type { ActionMethod } from "@/lib/actions/types";

export const QUICK_ACTION_CATEGORY_LABELS: Record<string, string> = {
  binders: "קלסרים",
  vat: 'מע"מ',
  annual_reports: 'דו"חות שנתיים',
};

export const QUICK_ACTION_CATEGORY_ORDER = [
  "vat",
  "annual_reports",
  "binders",
] as const;

export const QUICK_ACTION_EFFECT_LABELS: Record<ActionMethod, string> = {
  get: "פתיחה",
  post: "פעולה",
  patch: "עדכון",
  put: "עדכון",
  delete: "מחיקה",
};

export const QUICK_ACTION_EFFECT_DESCRIPTIONS: Record<ActionMethod, string> = {
  get: "ניווט לפריט ללא שינוי",
  post: "מבצע פעולה במערכת",
  patch: "מעדכן נתונים במערכת",
  put: "מעדכן נתונים במערכת",
  delete: "מוחק או מבטל פריט",
};

export const QUICK_ACTION_COPY = {
  title: "פעולות מהירות",
  emptyTitle: "הכל מטופל!",
  emptyDescription: "אין פעולות ממתינות כרגע",
  noActions: "אין פעולות דורשות טיפול",
  loading: "מבצע פעולה...",
  requiresConfirmation: "דורש אישור",
  fallbackCategory: "כללי",
  fallbackEffect: "פעולה",
  fallbackEffectDescription: "מבצע פעולה במערכת",
  footerHint:
    'פעולות "פתיחה" מנווטות לפריט בלבד. פעולות "פעולה/עדכון" מבצעות שינוי במערכת ופעולות המסומנות "דורש אישור" יציגו חלון אישור לפני הביצוע.',
} as const;

export const QUICK_ACTION_URGENCY_LABELS: Record<string, string> = {
  overdue: "באיחור",
  upcoming: "מתקרב",
};

export const QUICK_ACTION_ENTER_DELAY_MS = 50;
