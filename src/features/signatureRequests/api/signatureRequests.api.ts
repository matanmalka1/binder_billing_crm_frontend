import axios from "axios";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  SignatureRequestListResponse,
  SignatureRequestWithAudit,
  AuditEvent,
  SignatureRequestResponse,
  CreateSignatureRequestPayload,
  SendSignatureRequestPayload,
  SendSignatureRequestResponse,
  CancelSignatureRequestPayload,
  SignerViewResponse,
  SignerDeclinePayload,
} from "./contracts";

export const signatureRequestsApi = {
  // ── Queries ──────────────────────────────────────────────────────────────

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

  // ── Mutations ────────────────────────────────────────────────────────────

  create: async (
    payload: CreateSignatureRequestPayload,
  ): Promise<SignatureRequestResponse> => {
    const response = await api.post<SignatureRequestResponse>(
      ENDPOINTS.signatureRequests,
      payload,
    );
    return response.data;
  },

  send: async (
    id: number,
    payload?: SendSignatureRequestPayload,
  ): Promise<SendSignatureRequestResponse> => {
    const response = await api.post<SendSignatureRequestResponse>(
      ENDPOINTS.signatureRequestSend(id),
      payload ?? {},
    );
    return response.data;
  },

  cancel: async (
    id: number,
    payload?: CancelSignatureRequestPayload,
  ): Promise<SignatureRequestResponse> => {
    const response = await api.post<SignatureRequestResponse>(
      ENDPOINTS.signatureRequestCancel(id),
      payload ?? {},
    );
    return response.data;
  },
};

// Public signer API (no auth — bypasses /api/v1 prefix)
const publicApi = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")
    : "http://localhost:8000",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const signerApi = {
  view: async (token: string): Promise<SignerViewResponse> => {
    const response = await publicApi.get<SignerViewResponse>(ENDPOINTS.signerView(token));
    return response.data;
  },

  approve: async (token: string): Promise<SignerViewResponse> => {
    const response = await publicApi.post<SignerViewResponse>(ENDPOINTS.signerApprove(token));
    return response.data;
  },

  decline: async (token: string, payload?: SignerDeclinePayload): Promise<SignerViewResponse> => {
    const response = await publicApi.post<SignerViewResponse>(
      ENDPOINTS.signerDecline(token),
      payload ?? {},
    );
    return response.data;
  },
};
