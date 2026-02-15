import { ENDPOINTS } from "../contracts/endpoints";
import { api } from "./client";

export interface PermanentDocumentResponse {
  id: number;
  client_id: number;
  document_type: string;
  storage_key: string;
  is_present: boolean;
  uploaded_by: number;
  uploaded_at: string;
}

export interface PermanentDocumentListResponse {
  items: PermanentDocumentResponse[];
}

export interface OperationalSignalsResponse {
  client_id: number;
  missing_documents: string[];
  binders_nearing_sla: Array<Record<string, unknown>>;
  binders_overdue: Array<Record<string, unknown>>;
}

export interface UploadDocumentPayload {
  client_id: number;
  document_type: "id_copy" | "power_of_attorney" | "engagement_agreement";
  file: File;
}

export const documentsApi = {
  upload: async (payload: UploadDocumentPayload): Promise<PermanentDocumentResponse> => {
    const formData = new FormData();
    formData.append("client_id", String(payload.client_id));
    formData.append("document_type", payload.document_type);
    formData.append("file", payload.file);

    const response = await api.post<PermanentDocumentResponse>(
      ENDPOINTS.documentsUpload,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  listByClient: async (clientId: number): Promise<PermanentDocumentListResponse> => {
    const response = await api.get<PermanentDocumentListResponse>(
      ENDPOINTS.documentsByClient(clientId),
    );
    return response.data;
  },

  getSignalsByClient: async (clientId: number): Promise<OperationalSignalsResponse> => {
    const response = await api.get<OperationalSignalsResponse>(
      ENDPOINTS.documentSignalsByClient(clientId),
    );
    return response.data;
  },
};
