import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  PermanentDocumentResponse,
  UploadDocumentPayload,
  RejectDocumentRequest,
  UpdateNotesRequest,
} from "./contracts";

export const documentsMutationsApi = {
  upload: async (payload: UploadDocumentPayload): Promise<PermanentDocumentResponse> => {
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
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.documentById(id));
  },

  replaceDocument: async (id: number, file: File): Promise<PermanentDocumentResponse> => {
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

  rejectDocument: async (id: number, notes: string): Promise<PermanentDocumentResponse> => {
    const response = await api.post<PermanentDocumentResponse>(
      ENDPOINTS.documentReject(id),
      { notes } satisfies RejectDocumentRequest,
    );
    return response.data;
  },

  updateNotes: async (id: number, notes: string): Promise<PermanentDocumentResponse> => {
    const response = await api.patch<PermanentDocumentResponse>(
      ENDPOINTS.documentNotes(id),
      { notes } satisfies UpdateNotesRequest,
    );
    return response.data;
  },
};
