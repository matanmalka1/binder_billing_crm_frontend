import { ENDPOINTS } from "./endpoints";
import { api } from "./client";

export interface AuthorityContactResponse {
  id: number;
  client_id: number;
  contact_type: string;
  name: string;
  office: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export const authorityContactsApi = {
  createAuthorityContact: async (
    clientId: number,
    payload: {
      contact_type: string;
      name: string;
      office?: string | null;
      phone?: string | null;
      email?: string | null;
      notes?: string | null;
    }
  ): Promise<AuthorityContactResponse> => {
    const response = await api.post<AuthorityContactResponse>(
      ENDPOINTS.clientAuthorityContacts(clientId),
      payload
    );
    return response.data;
  },

  listAuthorityContacts: async (
    clientId: number,
    contactType?: string
  ): Promise<{ items: AuthorityContactResponse[] }> => {
    const response = await api.get<{ items: AuthorityContactResponse[] }>(
      ENDPOINTS.clientAuthorityContacts(clientId),
      { params: contactType ? { contact_type: contactType } : undefined }
    );
    return response.data;
  },

  updateAuthorityContact: async (
    contactId: number,
    payload: Partial<{
      contact_type: string;
      name: string;
      office: string | null;
      phone: string | null;
      email: string | null;
      notes: string | null;
    }>
  ): Promise<AuthorityContactResponse> => {
    const response = await api.patch<AuthorityContactResponse>(
      ENDPOINTS.authorityContactById(contactId),
      payload
    );
    return response.data;
  },

  deleteAuthorityContact: async (contactId: number): Promise<void> => {
    await api.delete(ENDPOINTS.authorityContactById(contactId));
  },
};
