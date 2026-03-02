import { makeLabelGetter } from "../utils/labels";

const contactTypeLabels = {
  assessing_officer: "פקיד שומה",
  vat_branch: "סניף מע״מ",
  national_insurance: "ביטוח לאומי",
  other: "אחר",
};

export const getContactTypeLabel = makeLabelGetter(contactTypeLabels);
