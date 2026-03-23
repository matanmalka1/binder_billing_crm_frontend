import axios from "axios";
import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  SignatureRequestResponse,
  CreateSignatureRequestPayload,
  SendSignatureRequestPayload,
  SendSignatureRequestResponse,
  CancelSignatureRequestPayload,
  SignerViewResponse,
  SignerDeclinePayload,
} from "./contracts";

export const signatureRequestsMutationsApi = {
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
