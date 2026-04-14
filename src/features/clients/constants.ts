import { makeLabelGetter } from "../../utils/labels";
import type { BusinessStatus, ClientResponse, ClientStatus, EntityType, VatType } from "./api";

export type ActiveClientDetailsTab =
  | "details"
  | "documents"
  | "deadlines"
  | "timeline"
  | "vat"
  | "advance-payments"
  | "annual-reports"
  | "communication"
  | "finance";
export type ClientIdNumberType = Exclude<ClientResponse["id_number_type"], null>;
export type ClientSortBy = "full_name" | "created_at" | "status";
export type ClientSortOrder = "asc" | "desc";

export const CLIENT_DETAILS_TABS: ActiveClientDetailsTab[] = [
  "details",
  "documents",
  "deadlines",
  "timeline",
  "vat",
  "advance-payments",
  "annual-reports",
  "communication",
  "finance",
];

export const CLIENT_DETAILS_TAB_LABELS: Record<ActiveClientDetailsTab, string> = {
  details: "פרטים",
  documents: "מסמכים",
  deadlines: "מועדים",
  timeline: "ציר זמן",
  vat: 'מע"מ (לקוח)',
  "advance-payments": "מקדמות",
  "annual-reports": "דוחות שנתיים",
  communication: "תקשורת",
  finance: "כספים",
};

export const CLIENT_ID_NUMBER_TYPES = [
  "individual",
  "corporation",
  "passport",
  "other",
] as const satisfies readonly ClientIdNumberType[];


export const ENTITY_TYPES = [
  "osek_patur",
  "osek_murshe",
  "company_ltd",
  "employee",
] as const satisfies readonly EntityType[];

export const CLIENT_ID_NUMBER_TYPE_LABELS: Record<ClientIdNumberType, string> = {
  individual: "יחיד / עוסק",
  corporation: "חברה / תאגיד",
  passport: "דרכון",
  other: "אחר",
};

export const CLIENT_ID_NUMBER_INPUT_LABELS: Record<ClientIdNumberType, string> = {
  individual: "מספר זהות",
  corporation: 'ח.פ / מספר תאגיד',
  passport: "מספר דרכון",
  other: "מספר מזהה",
};

export const CLIENT_ID_NUMBER_PLACEHOLDERS: Record<ClientIdNumberType, string> = {
  individual: "123456789",
  corporation: "512345678",
  passport: "1234567",
  other: "הזן מספר מזהה",
};

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  osek_patur: "עוסק פטור",
  osek_murshe: "עוסק מורשה",
  company_ltd: 'חברה בע"מ',
  employee: "שכיר",
};

export const CLIENT_STATUSES = ["active", "frozen", "closed"] as const satisfies readonly ClientStatus[];

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: "פעיל",
  frozen: "מוקפא",
  closed: "סגור",
};

export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  active: "פעיל",
  frozen: "מוקפא",
  closed: "סגור",
};

export const VAT_TYPES = ["monthly", "bimonthly", "exempt"] as const satisfies readonly VatType[];

export const VAT_TYPE_LABELS: Record<VatType, string> = {
  monthly: "חודשי",
  bimonthly: "דו-חודשי",
  exempt: "פטור",
};

export const ENTITY_OPTIONS_BY_ID_TYPE: Record<ClientIdNumberType, EntityType[]> = {
  individual: ["osek_patur", "osek_murshe", "employee"],
  corporation: ["company_ltd"],
  passport: ["osek_patur", "osek_murshe", "employee"],
  other: ["osek_patur", "osek_murshe", "company_ltd", "employee"],
};

export const CLIENT_ID_NUMBER_TYPE_OPTIONS = CLIENT_ID_NUMBER_TYPES.map((type) => ({
  value: type,
  label: CLIENT_ID_NUMBER_TYPE_LABELS[type],
}));

export const CLIENT_STATUS_OPTIONS = CLIENT_STATUSES.map((status) => ({
  value: status,
  label: CLIENT_STATUS_LABELS[status],
}));

export const VAT_TYPE_OPTIONS = VAT_TYPES.map((type) => ({
  value: type,
  label: VAT_TYPE_LABELS[type],
}));

export const CLIENT_SORT_BY_OPTIONS: { value: ClientSortBy; label: string }[] = [
  { value: "full_name", label: "שם לקוח" },
  { value: "created_at", label: "תאריך יצירה" },
  { value: "status", label: "סטטוס" },
];

export const CLIENT_SORT_ORDER_OPTIONS: { value: ClientSortOrder; label: string }[] = [
  { value: "asc", label: "סדר עולה" },
  { value: "desc", label: "סדר יורד" },
];

export const DEFAULT_CLIENT_SORT_BY: ClientSortBy = "full_name";
export const DEFAULT_CLIENT_SORT_ORDER: ClientSortOrder = "asc";

export const CLIENT_ID_TYPES_REQUIRING_ISRAELI_NUMERIC_ID: readonly ClientIdNumberType[] = [
  "individual",
  "corporation",
] as const;

export const CLIENT_ID_TYPES_REQUIRING_ISRAELI_ID_CHECKSUM: readonly ClientIdNumberType[] = [
  "individual",
] as const;

export const DEFAULT_CLIENT_ID_NUMBER_TYPE: ClientIdNumberType = "individual";
export const DEFAULT_VAT_EXEMPT_CEILING = "120000";

export const requiresIsraeliNumericId = (idNumberType: ClientIdNumberType): boolean =>
  CLIENT_ID_TYPES_REQUIRING_ISRAELI_NUMERIC_ID.includes(idNumberType);

export const requiresIsraeliIdChecksum = (idNumberType: ClientIdNumberType): boolean =>
  CLIENT_ID_TYPES_REQUIRING_ISRAELI_ID_CHECKSUM.includes(idNumberType);

export const getClientIdNumberTypeLabel = makeLabelGetter(CLIENT_ID_NUMBER_TYPE_LABELS);

export const getEntityTypeLabel = makeLabelGetter(ENTITY_TYPE_LABELS);
export const getClientStatusLabel = makeLabelGetter(CLIENT_STATUS_LABELS);
export const getVatTypeLabel = makeLabelGetter(VAT_TYPE_LABELS);
