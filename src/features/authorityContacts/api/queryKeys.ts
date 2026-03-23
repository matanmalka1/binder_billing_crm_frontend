export const authorityContactsQK = {
  forClient: (clientId: number) => ["authority-contacts", "client", clientId] as const,
  detail: (contactId: number) => ["authority-contacts", "detail", contactId] as const,
} as const;
