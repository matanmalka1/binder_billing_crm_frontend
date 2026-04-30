export const correspondenceQK = {
  forBusiness: (businessId: number) => ['correspondence', 'business', businessId] as const,
  forClient: (clientId: number) => ['correspondence', 'client', clientId] as const,
} as const
