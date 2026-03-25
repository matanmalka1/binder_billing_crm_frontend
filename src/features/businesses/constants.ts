export type ActiveBusinessDetailsTab =
  | "documents"
  | "timeline"
  | "vat"
  | "advance-payments"
  | "deadlines"
  | "annual-reports"
  | "details";

export const BUSINESS_DETAILS_TABS: ActiveBusinessDetailsTab[] = [
  "details",
  "documents",
  "timeline",
  "vat",
  "advance-payments",
  "deadlines",
  "annual-reports",
];

export const BUSINESS_DETAILS_TAB_LABELS: Record<ActiveBusinessDetailsTab, string> = {
  documents: "מסמכים",
  timeline: "ציר זמן",
  vat: 'מע"מ',
  "advance-payments": "מקדמות",
  deadlines: "מועדים",
  "annual-reports": "דוחות שנתיים",
  details: "פרטים",
};
