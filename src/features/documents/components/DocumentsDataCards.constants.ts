import { DOC_TYPE_LABELS } from "../documents.constants";

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEAR_RANGE = 7;
const TAX_YEARS = Array.from(
  { length: TAX_YEAR_RANGE },
  (_, i) => CURRENT_YEAR - i,
);

const ALL_DOCUMENT_TYPES_OPTION = { value: "", label: "כל הסוגים" };
const ALL_TAX_YEARS_OPTION = { value: "", label: "כל השנים" };

export const UPLOAD_FORM_ID = "documents-upload-form";
export const SEARCH_PLACEHOLDER = "חיפוש לפי שם קובץ או סוג מסמך";
export const DOWNLOAD_ERROR_MESSAGE = "שגיאה בהורדת המסמך";
export const PREVIEW_ERROR_MESSAGE = "שגיאה בטעינת המסמך";

export const DOCUMENT_TYPE_OPTIONS = [
  ALL_DOCUMENT_TYPES_OPTION,
  ...Object.entries(DOC_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

export const TAX_YEAR_OPTIONS = [
  ALL_TAX_YEARS_OPTION,
  ...TAX_YEARS.map((year) => ({
    value: String(year),
    label: String(year),
  })),
];
