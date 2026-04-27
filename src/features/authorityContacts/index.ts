// Public surface of the authorityContacts feature
export { authorityContactsApi, authorityContactsQK, getContactTypeLabel } from "./api";
export { AuthorityContactsCard } from "./components/AuthorityContactsCard";
export { AUTHORITY_CONTACT_TEXT } from "./constants";
export type {
  ContactType,
  AuthorityContactResponse,
  AuthorityContactCreatePayload,
  AuthorityContactUpdatePayload,
} from "./api";
