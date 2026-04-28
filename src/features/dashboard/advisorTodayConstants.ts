export const ADVISOR_TODAY_COPY = {
  title: "מה לעשות היום",
  loading: "טוען משימות...",
  pendingCount: (count: number) => `${count} פריטים ממתינים לטיפול`,
  taxDeadlinesTitle: "מועדי מס החודש",
  taxDeadlinesEmpty: "אין מועדים קרובים",
  stuckReportsTitle: "דוחות תקועים",
  stuckReportsEmpty: "אין דוחות תקועים",
  remindersTitle: "תזכורות פתוחות",
  remindersEmpty: "אין תזכורות תלויות",
} as const;

export const ADVISOR_TODAY_LIMITS = {
  upcomingDeadlineDays: 30,
  staleReminderDays: 7,
  stuckReportDays: 14,
  taxDeadlinePageSize: 50,
  annualReportsPageSize: 100,
  remindersPageSize: 50,
  reminderPreviewLength: 48,
} as const;

export const DONE_REPORT_STATUSES = [
  "submitted",
  "accepted",
  "assessment_issued",
  "closed",
] as const;

export const DASHBOARD_DEADLINE_LABELS: Record<string, string> = {
  vat: "דיווח מע״מ תקופתי",
  advance_payment: "מקדמות מס הכנסה",
  national_insurance: "מועד תשלום ביטוח לאומי",
  annual_report: "הגשת דוחות שנתיים",
};
