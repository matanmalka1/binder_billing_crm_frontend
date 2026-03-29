export const AUTHORITY_CONTACT_ENDPOINTS = {
  businessAuthorityContacts: (businessId: number | string) =>
    `/businesses/${businessId}/authority-contacts`,
  authorityContactById: (id: number | string) => `/businesses/authority-contacts/${id}`,
} as const;
