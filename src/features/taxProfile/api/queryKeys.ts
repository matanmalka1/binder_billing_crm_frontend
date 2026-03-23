export const taxProfileQK = {
  // Tax profile is nested under clients QK: clients.taxProfile(id)
  // Kept here for completeness; prefer QK.clients.taxProfile from src/lib/queryKeys.ts
  forClient: (clientId: number) => ["clients", "tax-profile", clientId] as const,
} as const;
