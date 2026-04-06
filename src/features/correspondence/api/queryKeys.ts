export const correspondenceQK = {
  forBusiness: (businessId: number) => ["correspondence", "business", businessId] as const,
  forClient: (businessId: number) => ["correspondence", "business", businessId] as const,
  forBusinessPaged: (businessId: number, params: object) =>
    ["correspondence", "business", businessId, params] as const,
} as const;
