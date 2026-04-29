export const ADVISOR_TODAY_LIMITS = {
  upcomingDeadlineDays: 30,
  staleReminderDays: 7,
  taxDeadlinePageSize: 50,
  remindersPageSize: 50,
  reminderPreviewLength: 48,
} as const;

export const DASHBOARD_DEADLINE_LABELS: Record<string, string> = {
  vat: "דיווח מע״מ תקופתי",
  advance_payment: "מקדמות מס הכנסה",
  national_insurance: "מועד תשלום ביטוח לאומי",
  annual_report: "הגשת דוחות שנתיים",
};
