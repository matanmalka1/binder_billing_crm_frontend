import { api } from "@/api/client";
import { DOCUMENT_ENDPOINTS } from "./endpoints";
import { toQueryParams } from "@/api/queryParams";
import type {
  PermanentDocumentListResponse,
  DocumentVersionsResponse,
  OperationalSignalsResponse,
  ListDocumentsByClientParams,
  PermanentDocumentResponse,
  UploadDocumentPayload,
  RejectDocumentRequest,
  UpdateNotesRequest,
} from "./contracts";

export const documentsApi = {
  // ── Queries ──────────────────────────────────────────────────────────────

  listByClient: async (
    businessId: number,
    params?: ListDocumentsByClientParams,
  ): Promise<PermanentDocumentListResponse> => {
    const response = await api.get<PermanentDocumentListResponse>(
      DOCUMENT_ENDPOINTS.documentsByBusiness(businessId),
      params ? { params: toQueryParams(params) } : undefined,
    );
    return response.data;
  },

  getDownloadUrl: async (id: number): Promise<{ url: string }> => {
    const response = await api.get<{ url: string }>(DOCUMENT_ENDPOINTS.documentDownloadUrl(id));
    return response.data;
  },

  getSignalsByClient: async (businessId: number): Promise<OperationalSignalsResponse> => {
    const response = await api.get<OperationalSignalsResponse>(
      DOCUMENT_ENDPOINTS.documentSignalsByBusiness(businessId),
    );
    return response.data;
  },

  getVersions: async (
    businessId: number,
    documentType: string,
    taxYear?: number,
  ): Promise<DocumentVersionsResponse> => {
    const response = await api.get<DocumentVersionsResponse>(
      DOCUMENT_ENDPOINTS.documentVersionsByBusiness(businessId),
      {
        params: toQueryParams({
          document_type: documentType,
          ...(taxYear != null ? { tax_year: taxYear } : {}),
        }),
      },
    );
    return response.data;
  },

  listByAnnualReport: async (reportId: number): Promise<DocumentVersionsResponse> => {
    const response = await api.get<DocumentVersionsResponse>(
      DOCUMENT_ENDPOINTS.documentsByAnnualReport(reportId),
    );
    return response.data;
  },

  // ── Mutations ────────────────────────────────────────────────────────────

  upload: async (payload: UploadDocumentPayload): Promise<PermanentDocumentResponse> => {
    const formData = new FormData();
    formData.append("business_id", String(payload.business_id));
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
      DOCUMENT_ENDPOINTS.documentsUpload,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(DOCUMENT_ENDPOINTS.documentById(id));
  },

  replaceDocument: async (id: number, file: File): Promise<PermanentDocumentResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.put<PermanentDocumentResponse>(
      DOCUMENT_ENDPOINTS.documentReplace(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  approveDocument: async (id: number): Promise<PermanentDocumentResponse> => {
    const response = await api.post<PermanentDocumentResponse>(
      DOCUMENT_ENDPOINTS.documentApprove(id),
    );
    return response.data;
  },

  rejectDocument: async (id: number, notes: string): Promise<PermanentDocumentResponse> => {
    const response = await api.post<PermanentDocumentResponse>(
      DOCUMENT_ENDPOINTS.documentReject(id),
      { notes } satisfies RejectDocumentRequest,
    );
    return response.data;
  },

  updateNotes: async (id: number, notes: string): Promise<PermanentDocumentResponse> => {
    const response = await api.patch<PermanentDocumentResponse>(
      DOCUMENT_ENDPOINTS.documentNotes(id),
      { notes } satisfies UpdateNotesRequest,
    );
    return response.data;
  },
};
