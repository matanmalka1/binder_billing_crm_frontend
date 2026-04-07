import { makeLabelGetter } from "../../utils/labels";
import type { BusinessType, ClientResponse } from "./api";

export type ActiveClientDetailsTab = "details";
export type ClientIdNumberType = Exclude<ClientResponse["id_number_type"], null>;

export const CLIENT_DETAILS_TABS: ActiveClientDetailsTab[] = ["details"];

export const CLIENT_DETAILS_TAB_LABELS: Record<ActiveClientDetailsTab, string> = {
  details: "פרטים",
};

export const CLIENT_ID_NUMBER_TYPES = [
  "individual",
  "corporation",
  "passport",
  "other",
] as const satisfies readonly ClientIdNumberType[];

export const BUSINESS_TYPES = [
  "osek_patur",
  "osek_murshe",
  "company",
  "employee",
] as const satisfies readonly BusinessType[];

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
  passport: "A1234567",
  other: "הזן מספר מזהה",
};

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  osek_patur: "עוסק פטור",
  osek_murshe: "עוסק מורשה",
  company: 'חברה בע"מ',
  employee: "שכיר",
};

export const getClientIdNumberTypeLabel = makeLabelGetter(CLIENT_ID_NUMBER_TYPE_LABELS);
export const getClientIdNumberInputLabel = makeLabelGetter(CLIENT_ID_NUMBER_INPUT_LABELS);
export const getBusinessTypeLabel = makeLabelGetter(BUSINESS_TYPE_LABELS);
