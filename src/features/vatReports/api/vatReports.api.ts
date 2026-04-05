import { api } from "@/api/client";
import { toQueryParams } from "@/api/queryParams";
import { downloadBlob } from "@/utils/download";
import { VAT_ENDPOINTS } from "./endpoints";
import type {
  VatWorkItemResponse,
  VatWorkItemListResponse,
  VatWorkItemsListParams,
  VatWorkItemLookupResponse,
  CreateVatWorkItemPayload,
  VatPeriodOptionsResponse,
  VatInvoiceResponse,
  VatInvoiceListResponse,
  CreateVatInvoicePayload,
  UpdateVatInvoicePayload,
  VatAuditTrailResponse,
  VatClientSummaryResponse,
  FileVatReturnPayload,
} from "./contracts";

export const vatReportsApi = {
  list: async (params: VatWorkItemsListParams): Promise<VatWorkItemListResponse> => {
    const response = await api.get<VatWorkItemListResponse>(VAT_ENDPOINTS.vatWorkItems, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  lookup: async (businessId: number, period: string): Promise<VatWorkItemLookupResponse | null> => {
    const response = await api.get<VatWorkItemLookupResponse | null>(VAT_ENDPOINTS.vatWorkItemLookup, {
      params: toQueryParams({ business_id: businessId, period }),
    });
    return response.data;
  },

  getById: async (id: number): Promise<VatWorkItemResponse> => {
    const response = await api.get<VatWorkItemResponse>(VAT_ENDPOINTS.vatWorkItemById(id));
    return response.data;
  },

  create: async (payload: CreateVatWorkItemPayload): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(VAT_ENDPOINTS.vatWorkItems, payload);
    return response.data;
  },

  getPeriodOptions: async (businessId: number, year?: number): Promise<VatPeriodOptionsResponse> => {
    const response = await api.get<VatPeriodOptionsResponse>(VAT_ENDPOINTS.vatPeriodOptions(businessId), {
      params: toQueryParams({ year }),
    });
    return response.data;
  },

  markMaterialsComplete: async (id: number): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(VAT_ENDPOINTS.vatWorkItemMaterialsComplete(id));
    return response.data;
  },

  markReadyForReview: async (id: number): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(VAT_ENDPOINTS.vatWorkItemReadyForReview(id));
    return response.data;
  },

  sendBack: async (id: number, correctionNote: string): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(VAT_ENDPOINTS.vatWorkItemSendBack(id), {
      correction_note: correctionNote,
    });
    return response.data;
  },

  fileVatReturn: async (id: number, payload: FileVatReturnPayload): Promise<VatWorkItemResponse> => {
    const response = await api.post<VatWorkItemResponse>(VAT_ENDPOINTS.vatWorkItemFile(id), payload);
    return response.data;
  },

  listInvoices: async (id: number): Promise<VatInvoiceListResponse> => {
    const response = await api.get<VatInvoiceListResponse>(VAT_ENDPOINTS.vatWorkItemInvoices(id));
    return response.data;
  },

  addInvoice: async (id: number, payload: CreateVatInvoicePayload): Promise<VatInvoiceResponse> => {
    const response = await api.post<VatInvoiceResponse>(VAT_ENDPOINTS.vatWorkItemInvoices(id), payload);
    return response.data;
  },

  updateInvoice: async (
    id: number,
    invoiceId: number,
    payload: UpdateVatInvoicePayload,
  ): Promise<VatInvoiceResponse> => {
    const response = await api.patch<VatInvoiceResponse>(
      VAT_ENDPOINTS.vatWorkItemInvoiceById(id, invoiceId),
      payload,
    );
    return response.data;
  },

  deleteInvoice: async (id: number, invoiceId: number): Promise<void> => {
    await api.delete(VAT_ENDPOINTS.vatWorkItemInvoiceById(id, invoiceId));
  },

  getAuditTrail: async (id: number): Promise<VatAuditTrailResponse> => {
    const response = await api.get<VatAuditTrailResponse>(VAT_ENDPOINTS.vatWorkItemAudit(id));
    return response.data;
  },

  listByBusiness: async (businessId: number): Promise<VatWorkItemListResponse> => {
    const response = await api.get<VatWorkItemListResponse>(VAT_ENDPOINTS.vatWorkItemsByBusiness(businessId));
    return response.data;
  },

  getBusinessSummary: async (businessId: number): Promise<VatClientSummaryResponse> => {
    const response = await api.get<VatClientSummaryResponse>(VAT_ENDPOINTS.vatBusinessSummary(businessId));
    return response.data;
  },

  exportBusinessVat: async (businessId: number, format: "excel" | "pdf", year: number): Promise<void> => {
    const response = await api.get<Blob>(VAT_ENDPOINTS.vatBusinessExport(businessId), {
      params: toQueryParams({ format, year }),
      responseType: "blob",
    });
    const contentDisposition = response.headers["content-disposition"];
    const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/);
    const ext = format === "excel" ? "xlsx" : "pdf";
    const filename = filenameMatch?.[1] || `vat_business_${businessId}_${year}.${ext}`;
    const mimeType =
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf";
    downloadBlob(response.data, filename, response.headers["content-type"] || mimeType);
  },
};
