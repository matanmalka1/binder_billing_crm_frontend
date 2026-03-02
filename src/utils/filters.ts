export const toOptionalNumber = (
  value: string | number | null | undefined,
): number | undefined => {
  if (value === "" || value == null) return undefined;
  const numericValue = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(numericValue) ? numericValue : undefined;
};

export const toOptionalString = (value: string | null | undefined): string | undefined => {
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};
