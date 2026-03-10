import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import { api } from "./client";
import type {
  CreateVatInvoicePayload,
  CreateVatWorkItemPayload,
  FileVatReturnPayload,
  VatAuditTrailResponse,
  VatClientSummaryResponse,
  VatInvoiceListResponse,
  VatInvoiceResponse,
  VatWorkItemListResponse,
  VatWorkItemResponse,
  VatWorkItemsListParams,
} from "./vatReports.types";

export const vatReportsApi = {
  list: async (params: VatWorkItemsListParams): Promise<VatWorkItemListResponse> => {
    const response = await api.get<VatWorkItemListResponse>(ENDPOINTS.vatWorkItems, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getById: async (id: number): Promise<VatWorkItemResponse> => {
    const response = await api.get<VatWorkItemResponse>(ENDPOINTS.vatWorkItemById(id));
    return response.data;
  },

  create: async (payload: CreateVatWorkItemPayload): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(ENDPOINTS.vatWorkItems, payload);
    return response.data;
  },

  markMaterialsComplete: async (id: number): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(
      ENDPOINTS.vatWorkItemMaterialsComplete(id),
    );
    return response.data;
  },

  markReadyForReview: async (id: number): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(
      ENDPOINTS.vatWorkItemReadyForReview(id),
    );
    return response.data;
  },

  sendBack: async (id: number, correctionNote: string): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(ENDPOINTS.vatWorkItemSendBack(id), {
      correction_note: correctionNote,
    });
    return response.data;
  },

  fileVatReturn: async (id: number, payload: FileVatReturnPayload): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(
      ENDPOINTS.vatWorkItemFile(id),
      payload,
    );
    return response.data;
  },

  listInvoices: async (id: number): Promise<VatInvoiceListResponse> => {
    const response = await api.get<VatInvoiceListResponse>(
      ENDPOINTS.vatWorkItemInvoices(id),
    );
    return response.data;
  },

  addInvoice: async (id: number, payload: CreateVatInvoicePayload): Promise<VatInvoiceResponse> => {
    const response = await api.post<VatInvoiceResponse>(
      ENDPOINTS.vatWorkItemInvoices(id),
      payload,
    );
    return response.data;
  },

  deleteInvoice: async (id: number, invoiceId: number): Promise<void> => {
    await api.delete(ENDPOINTS.vatWorkItemInvoiceById(id, invoiceId));
  },

  getAuditTrail: async (id: number): Promise<VatAuditTrailResponse> => {
    const response = await api.get<VatAuditTrailResponse>(ENDPOINTS.vatWorkItemAudit(id));
    return response.data;
  },

  listByClient: async (clientId: number): Promise<VatWorkItemListResponse> => {
    const response = await api.get<VatWorkItemListResponse>(
      ENDPOINTS.vatWorkItemsByClient(clientId),
    );
    return response.data;
  },

  getClientSummary: async (clientId: number): Promise<VatClientSummaryResponse> => {
    const response = await api.get<VatClientSummaryResponse>(
      ENDPOINTS.vatClientSummary(clientId),
    );
    return response.data;
  },

  exportClientVat: async (
    clientId: number,
    format: "excel" | "pdf",
    year: number,
  ): Promise<void> => {
    const response = await api.get<Blob>(ENDPOINTS.vatClientExport(clientId), {
      params: { format, year },
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/);
    const ext = format === "excel" ? "xlsx" : "pdf";
    const filename = filenameMatch?.[1] || `vat_${clientId}_${year}.${ext}`;

    const mimeType =
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf";

    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || mimeType,
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
