import { api } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { PaginatedResponse } from "../types/common";

export type SignatureRequestStatus =
  | "draft"
  | "pending_signature"
  | "signed"
  | "declined"
  | "expired"
  | "canceled";

export type SignatureRequestType =
  | "engagement_agreement"
  | "annual_report_approval"
  | "power_of_attorney"
  | "vat_return_approval"
  | "custom";

export interface SignatureRequestResponse {
  id: number;
  client_id: number;
  created_by: number;
  request_type: SignatureRequestType;
  title: string;
  description: string | null;
  signer_name: string;
  signer_email: string | null;
  signer_phone: string | null;
  status: SignatureRequestStatus;
  created_at: string;
  sent_at: string | null;
  expires_at: string | null;
  signed_at: string | null;
  declined_at: string | null;
  canceled_at: string | null;
  decline_reason: string | null;
  annual_report_id: number | null;
  document_id: number | null;
}

export interface AuditEvent {
  id: number;
  event_type: string;
  actor_type: string;
  actor_name: string | null;
  ip_address: string | null;
  notes: string | null;
  created_at: string;
}

export interface SignatureRequestWithAudit extends SignatureRequestResponse {
  audit_events: AuditEvent[];
}

export interface CreateSignatureRequestPayload {
  client_id: number;
  request_type: SignatureRequestType;
  title: string;
  description?: string;
  signer_name?: string;
  signer_email?: string;
  signer_phone?: string;
}

export interface SendSignatureRequestPayload {
  expiry_days?: number;
}

export interface SendSignatureRequestResponse extends SignatureRequestResponse {
  signing_token: string;
  signing_url_hint: string;
}

export interface CancelSignatureRequestPayload {
  reason?: string;
}

export interface SignerViewResponse {
  title: string;
  description: string | null;
  signer_name: string;
  request_type: SignatureRequestType;
  status: SignatureRequestStatus;
  expires_at: string | null;
  content_hash: string | null;
  created_at: string;
}

export interface SignerDeclinePayload {
  reason?: string;
}

export type SignatureRequestListResponse =
  PaginatedResponse<SignatureRequestResponse>;

export const signatureRequestsApi = {
  listForClient: async (
    clientId: number,
    params?: { page?: number; page_size?: number; status?: string },
  ): Promise<SignatureRequestListResponse> => {
    const response = await api.get<SignatureRequestListResponse>(
      ENDPOINTS.clientSignatureRequests(clientId),
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

  getAuditTrail: async (id: number): Promise<AuditEvent[]> => {
    const response = await api.get<AuditEvent[]>(
      ENDPOINTS.signatureRequestAuditTrail(id),
    );
    return response.data;
  },
};

// Public signer API (no auth)
import axios from "axios";

const PUBLIC_BASE = import.meta.env?.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")
  : "http://localhost:8000";

const publicApi = axios.create({
  baseURL: PUBLIC_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const signerApi = {
  view: async (token: string): Promise<SignerViewResponse> => {
    const response = await publicApi.get<SignerViewResponse>(`/sign/${token}`);
    return response.data;
  },

  approve: async (token: string): Promise<{ status: string }> => {
    const response = await publicApi.post<{ status: string }>(
      `/sign/${token}/approve`,
    );
    return response.data;
  },

  decline: async (
    token: string,
    payload?: SignerDeclinePayload,
  ): Promise<{ status: string }> => {
    const response = await publicApi.post<{ status: string }>(
      `/sign/${token}/decline`,
      payload ?? {},
    );
    return response.data;
  },
};
