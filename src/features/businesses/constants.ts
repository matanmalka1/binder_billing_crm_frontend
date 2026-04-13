import { makeLabelGetter } from "@/utils/labels";
import type { BusinessResponse, BusinessStatus, BusinessType } from "@/features/clients/api";

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  osek_patur: "עוסק פטור",
  osek_murshe: "עוסק מורשה",
  company: 'חברה בע"מ',
  employee: "שכיר",
};

export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  active: "פעיל",
  frozen: "מוקפא",
  closed: "סגור",
};

export const getBusinessTypeLabel = makeLabelGetter(BUSINESS_TYPE_LABELS);
export const getBusinessStatusLabel = makeLabelGetter(BUSINESS_STATUS_LABELS);

export const BUSINESS_DETAILS_COPY = {
  title: "פרטי עסק",
  invalidId: "מזהה לא תקין",
  loading: "טוען פרטי עסק...",
  clientsListLabel: "לקוחות",
  clientFallback: "לקוח",
  sectionTitle: "פרטי פעילות",
  systemIdLabel: "מזהה מערכת",
  clientLabel: "לקוח",
  businessNameLabel: "שם עסק",
  businessTypeLabel: "סוג עסק",
  statusLabel: "סטטוס",
  openedAtLabel: "נפתח בתאריך",
  closedAtLabel: "נסגר בתאריך",
  createdAtLabel: "נוצר בתאריך",
  emptyValue: "—",
  notesTitle: "הערות",
  noNotes: "אין הערות",
} as const;

export const formatBusinessDisplayName = (business: Pick<BusinessResponse, "business_type" | "business_name">) =>
  `${getBusinessTypeLabel(business.business_type)}${business.business_name ? ` — ${business.business_name}` : ""}`;
