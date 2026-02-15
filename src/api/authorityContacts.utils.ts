const contactTypeLabels: Record<string, string> = {
  assessing_officer: "פקיד שומה",
  vat_branch: "סניף מע״מ",
  national_insurance: "ביטוח לאומי",
  other: "אחר",
};

export const getContactTypeLabel = (type: string): string => {
  return contactTypeLabels[type] || "—";
};
