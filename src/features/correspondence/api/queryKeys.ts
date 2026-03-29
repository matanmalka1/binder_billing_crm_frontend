export const correspondenceQK = {
  forBusiness: (businessId: number) => ["correspondence", "business", businessId] as const,
  forClient: (businessId: number) => ["correspondence", "business", businessId] as const,
} as const;
