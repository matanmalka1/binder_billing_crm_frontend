import type { PaginatedResponse } from "../types/common";
import { ENDPOINTS } from "./endpoints";
import { toQueryParams } from "./queryParams";
import { api } from "./client";

// ── Work Item ─────────────────────────────────────────────────────────────────

export interface VatWorkItemResponse {
  id: number;
  client_id: number;
  client_name: string | null;
  period: string;
  status: string;
  pending_materials_note: string | null;
  total_output_vat: number;
  total_input_vat: number;
  net_vat: number;
  final_vat_amount: number | null;
  is_overridden: boolean;
  override_justification: string | null;
  filing_method: string | null;
  filed_at: string | null;
  filed_by: number | null;
  created_by: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
}

export type VatWorkItemListResponse = PaginatedResponse<VatWorkItemResponse>;

export interface VatWorkItemsListParams {
  status?: string;
  page?: number;
  page_size?: number;
}

export interface CreateVatWorkItemPayload {
  client_id: number;
  period: string;
  assigned_to?: number | null;
  mark_pending?: boolean;
  pending_materials_note?: string | null;
}

// ── Invoice ───────────────────────────────────────────────────────────────────

export interface VatInvoiceResponse {
  id: number;
  work_item_id: number;
  invoice_type: string;
  invoice_number: string;
  invoice_date: string;
  counterparty_name: string;
  counterparty_id: string | null;
  net_amount: number;
  vat_amount: number;
  expense_category: string | null;
  created_by: number;
  created_at: string;
}

export interface VatInvoiceListResponse {
  items: VatInvoiceResponse[];
}

export interface CreateVatInvoicePayload {
  invoice_type: "income" | "expense";
  invoice_number: string;
  invoice_date: string;
  counterparty_name: string;
  net_amount: number;
  vat_amount: number;
  counterparty_id?: string | null;
  expense_category?: string | null;
}

// ── Audit ─────────────────────────────────────────────────────────────────────

export interface VatAuditLogResponse {
  id: number;
  work_item_id: number;
  performed_by: number;
  action: string;
  old_value: string | null;
  new_value: string | null;
  note: string | null;
  performed_at: string;
}

export interface VatAuditTrailResponse {
  items: VatAuditLogResponse[];
}

// ── Filing ────────────────────────────────────────────────────────────────────

export interface FileVatReturnPayload {
  filing_method: "manual" | "online";
  override_amount?: string | null;
  override_justification?: string | null;
}

// ── API ───────────────────────────────────────────────────────────────────────

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
};
