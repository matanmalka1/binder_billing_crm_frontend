export const ADVISOR_TODAY_LIMITS = {
  upcomingDeadlineDays: 30,
  staleReminderDays: 7,
  taxDeadlinePageSize: 50,
  remindersPageSize: 50,
  reminderPreviewLength: 48,
} as const;

export const DASHBOARD_DEADLINE_COPY: Record<string, { title: string; action: string }> = {
  vat: { title: "מע״מ", action: "הגשה ותשלום" },
  advance_payment: { title: "מס הכנסה", action: "תשלום מקדמות" },
  national_insurance: { title: "ביטוח לאומי", action: "תשלום מקדמות" },
  annual_report: { title: "דוחות שנתיים", action: "הגשה" },
};
