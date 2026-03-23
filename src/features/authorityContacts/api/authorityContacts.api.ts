import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  AuthorityContactResponse,
  AuthorityContactCreatePayload,
  AuthorityContactUpdatePayload,
  ContactType,
} from "./contracts";

export const authorityContactsApi = {
  createAuthorityContact: async (
    clientId: number,
    payload: AuthorityContactCreatePayload,
  ): Promise<AuthorityContactResponse> => {
    const response = await api.post<AuthorityContactResponse>(
      ENDPOINTS.businessAuthorityContacts(clientId),
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
      ENDPOINTS.businessAuthorityContacts(clientId),
      { params: { ...(contactType ? { contact_type: contactType } : {}), page, page_size } },
    );
    return response.data;
  },

  getAuthorityContact: async (contactId: number): Promise<AuthorityContactResponse> => {
    const response = await api.get<AuthorityContactResponse>(
      ENDPOINTS.authorityContactById(contactId),
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
