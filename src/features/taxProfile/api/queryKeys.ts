export const taxProfileQK = {
  forBusiness: (businessId: number) => ["businesses", "tax-profile", businessId] as const,
  forClient: (businessId: number) => ["businesses", "tax-profile", businessId] as const,
} as const;
