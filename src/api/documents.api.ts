import { ENDPOINTS } from "./endpoints";
import { api } from "./client";
import { toQueryParams } from "./queryParams";

export interface PermanentDocumentResponse {
  id: number;
  client_id: number;
  document_type: string;
  storage_key: string;
  tax_year: number | null;
  is_present: boolean;
  uploaded_by: number;
  uploaded_at: string;
  version: number;
  superseded_by: number | null;
  status: string;
  annual_report_id: number | null;
  original_filename: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  notes: string | null;
  approved_by: number | null;
  approved_at: string | null;
  is_deleted: boolean;
}

export interface PermanentDocumentListResponse {
  items: PermanentDocumentResponse[];
}

export interface DocumentVersionsResponse {
  items: PermanentDocumentResponse[];
}

export interface OperationalSignalsResponse {
  client_id: number;
  missing_documents: string[];
}

export interface RejectDocumentRequest {
  notes: string;
}

export interface UpdateNotesRequest {
  notes: string;
}

export interface UploadDocumentPayload {
  client_id: number;
  document_type:
    | "id_copy"
    | "power_of_attorney"
    | "engagement_agreement"
    | "tax_form"
    | "receipt"
    | "invoice_doc"
    | "bank_approval"
    | "withholding_certificate"
    | "nii_approval"
    | "other";
  file: File;
  tax_year?: number | null;
  annual_report_id?: number | null;
  notes?: string | null;
}

export interface ListDocumentsByClientParams {
  tax_year?: number;
}

export const documentsApi = {
  upload: async (
    payload: UploadDocumentPayload,
  ): Promise<PermanentDocumentResponse> => {
    const formData = new FormData();
    formData.append("client_id", String(payload.client_id));
    formData.append("document_type", payload.document_type);
    formData.append("file", payload.file);
    if (payload.tax_year != null) {
      formData.append("tax_year", String(payload.tax_year));
    }
    if (payload.annual_report_id != null) {
      formData.append("annual_report_id", String(payload.annual_report_id));
    }
    if (payload.notes != null) {
      formData.append("notes", payload.notes);
    }

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

  listByClient: async (
    clientId: number,
    params?: ListDocumentsByClientParams,
  ): Promise<PermanentDocumentListResponse> => {
    const response = await api.get<PermanentDocumentListResponse>(
      ENDPOINTS.documentsByClient(clientId),
      params ? { params: toQueryParams(params) } : undefined,
    );
    return response.data;
  },

  getDownloadUrl: async (id: number): Promise<{ url: string }> => {
    const response = await api.get<{ url: string }>(ENDPOINTS.documentDownloadUrl(id));
    return response.data;
  },

  getSignalsByClient: async (
    clientId: number,
  ): Promise<OperationalSignalsResponse> => {
    const response = await api.get<OperationalSignalsResponse>(
      ENDPOINTS.documentSignalsByClient(clientId),
    );
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.documentById(id));
  },

  replaceDocument: async (
    id: number,
    file: File,
  ): Promise<PermanentDocumentResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.put<PermanentDocumentResponse>(
      ENDPOINTS.documentReplace(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  approveDocument: async (id: number): Promise<PermanentDocumentResponse> => {
    const response = await api.post<PermanentDocumentResponse>(
      ENDPOINTS.documentApprove(id),
    );
    return response.data;
  },

  rejectDocument: async (
    id: number,
    notes: string,
  ): Promise<PermanentDocumentResponse> => {
    const response = await api.post<PermanentDocumentResponse>(
      ENDPOINTS.documentReject(id),
      { notes } satisfies RejectDocumentRequest,
    );
    return response.data;
  },

  getVersions: async (
    clientId: number,
    documentType: string,
    taxYear?: number,
  ): Promise<DocumentVersionsResponse> => {
    const response = await api.get<DocumentVersionsResponse>(
      ENDPOINTS.documentVersions(clientId),
      {
        params: toQueryParams({
          document_type: documentType,
          ...(taxYear != null ? { tax_year: taxYear } : {}),
        }),
      },
    );
    return response.data;
  },

  listByAnnualReport: async (
    reportId: number,
  ): Promise<DocumentVersionsResponse> => {
    const response = await api.get<DocumentVersionsResponse>(
      ENDPOINTS.documentsByAnnualReport(reportId),
    );
    return response.data;
  },

  updateNotes: async (
    id: number,
    notes: string,
  ): Promise<PermanentDocumentResponse> => {
    const response = await api.patch<PermanentDocumentResponse>(
      ENDPOINTS.documentNotes(id),
      { notes } satisfies UpdateNotesRequest,
    );
    return response.data;
  },
};
