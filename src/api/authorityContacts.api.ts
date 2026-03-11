import { ENDPOINTS } from "./endpoints";
import { api } from "./client";

export type ContactType =
  | "assessing_officer"
  | "vat_branch"
  | "national_insurance"
  | "other";

export interface AuthorityContactResponse {
  id: number;
  client_id: number;
  contact_type: ContactType;
  name: string;
  office: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AuthorityContactCreatePayload {
  contact_type: ContactType;
  name: string;
  office?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

export interface AuthorityContactUpdatePayload {
  contact_type?: ContactType;
  name?: string;
  office?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

export const authorityContactsApi = {
  createAuthorityContact: async (
    clientId: number,
    payload: AuthorityContactCreatePayload,
  ): Promise<AuthorityContactResponse> => {
    const response = await api.post<AuthorityContactResponse>(
      ENDPOINTS.clientAuthorityContacts(clientId),
      payload,
    );
    return response.data;
  },

  listAuthorityContacts: async (
    clientId: number,
    contactType?: ContactType,
    page: number = 1,
    page_size: number = 20,
  ): Promise<{ items: AuthorityContactResponse[]; page: number; page_size: number; total: number }> => {
    const response = await api.get<{ items: AuthorityContactResponse[]; page: number; page_size: number; total: number }>(
      ENDPOINTS.clientAuthorityContacts(clientId),
      { params: { ...(contactType ? { contact_type: contactType } : {}), page, page_size } },
    );
    return response.data;
  },

  getAuthorityContact: async (contactId: number): Promise<AuthorityContactResponse> => {
    const response = await api.get<AuthorityContactResponse>(
      ENDPOINTS.AUTHORITY_CONTACT_DETAIL(contactId),
    );
    return response.data;
  },

  updateAuthorityContact: async (
    contactId: number,
    payload: AuthorityContactUpdatePayload,
  ): Promise<AuthorityContactResponse> => {
    const response = await api.patch<AuthorityContactResponse>(
      ENDPOINTS.authorityContactById(contactId),
      payload,
    );
    return response.data;
  },

  deleteAuthorityContact: async (contactId: number): Promise<void> => {
    await api.delete(ENDPOINTS.authorityContactById(contactId));
  },
};
