import { makeLabelGetter } from "@/utils/labels";
import type { BusinessResponse, BusinessStatus } from "@/features/clients";

export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  active: "פעיל",
  frozen: "מוקפא",
  closed: "סגור",
};

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

export const formatBusinessDisplayName = (business: Pick<BusinessResponse, "business_name">) =>
  business.business_name ?? "—";
