export const authorityContactsQK = {
  forBusiness: (businessId: number) => ["authority-contacts", "business", businessId] as const,
  forClient: (businessId: number) => ["authority-contacts", "business", businessId] as const,
  forBusinessPaged: (businessId: number, params: object) =>
    ["authority-contacts", "business", businessId, params] as const,
  detail: (contactId: number) => ["authority-contacts", "detail", contactId] as const,
} as const;
