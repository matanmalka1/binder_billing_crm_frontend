import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  SignatureRequestListResponse,
  SignatureRequestWithAudit,
  AuditEvent,
} from "./contracts";

export const signatureRequestsQueriesApi = {
  listForClient: async (
    clientId: number,
    params?: { page?: number; page_size?: number; status?: string },
  ): Promise<SignatureRequestListResponse> => {
    const response = await api.get<SignatureRequestListResponse>(
      ENDPOINTS.businessSignatureRequests(clientId),
      { params },
    );
    return response.data;
  },

  listPending: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<SignatureRequestListResponse> => {
    const response = await api.get<SignatureRequestListResponse>(
      ENDPOINTS.signatureRequestsPending,
      { params },
    );
    return response.data;
  },

  getById: async (id: number): Promise<SignatureRequestWithAudit> => {
    const response = await api.get<SignatureRequestWithAudit>(
      ENDPOINTS.signatureRequestById(id),
    );
    return response.data;
  },

  getAuditTrail: async (id: number): Promise<AuditEvent[]> => {
    const response = await api.get<AuditEvent[]>(
      ENDPOINTS.signatureRequestAuditTrail(id),
    );
    return response.data;
  },
};
