export const notesQK = {
  forClient: (clientId: number) => ["notes", "client", clientId] as const,
  forBusiness: (businessId: number) => ["notes", "business", businessId] as const,
} as const;
