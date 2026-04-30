export const taxProfileQK = {
  forClient: (clientId: number) => ['clients', 'tax-profile', clientId] as const,
} as const
