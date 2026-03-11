export type ActiveClientDetailsTab =
  | "details"
  | "documents"
  | "timeline"
  | "vat"
  | "advance-payments"
  | "deadlines"
  | "notifications"
  | "annual-reports";

export const CLIENT_DETAILS_TABS: ActiveClientDetailsTab[] = [
  "details",
  "documents",
  "timeline",
  "vat",
  "advance-payments",
  "deadlines",
  "notifications",
  "annual-reports",
];

export const CLIENT_DETAILS_TAB_LABELS: Record<ActiveClientDetailsTab, string> = {
  details: "פרטים",
  documents: "מסמכים",
  timeline: "ציר זמן",
  vat: 'מע"מ',
  "advance-payments": "מקדמות",
  deadlines: "מועדים",
  notifications: "התראות",
  "annual-reports": "דוחות שנתיים",
};
