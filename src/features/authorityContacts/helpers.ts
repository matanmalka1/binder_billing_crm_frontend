import type { AuthorityContactCreatePayload, AuthorityContactResponse } from './api'
import type { AuthorityContactFormValues } from './schemas'
import { authorityContactDefaults } from './schemas'
import { AUTHORITY_CONTACT_TEXT } from './constants'

export const getAuthorityContactsSubtitle = (total: number) =>
  total > 0 ? `${total} ${AUTHORITY_CONTACT_TEXT.totalSuffix}` : AUTHORITY_CONTACT_TEXT.defaultSubtitle

export const toAuthorityContactFormValues = (contact?: AuthorityContactResponse | null): AuthorityContactFormValues =>
  contact
    ? {
        contact_type: contact.contact_type,
        name: contact.name,
        office: contact.office ?? '',
        phone: contact.phone ?? '',
        email: contact.email ?? '',
        notes: contact.notes ?? '',
      }
    : authorityContactDefaults

const emptyToNull = (value?: string) => value || null

export const toAuthorityContactPayload = (values: AuthorityContactFormValues): AuthorityContactCreatePayload => ({
  ...values,
  office: emptyToNull(values.office),
  phone: emptyToNull(values.phone),
  email: emptyToNull(values.email),
  notes: emptyToNull(values.notes),
})
