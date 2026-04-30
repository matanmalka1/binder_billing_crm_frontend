export const AUTHORITY_CONTACT_ENDPOINTS = {
  clientAuthorityContacts: (clientId: number | string) => `/clients/${clientId}/authority-contacts`,
  authorityContactById: (id: number | string) => `/clients/authority-contacts/${id}`,
} as const
