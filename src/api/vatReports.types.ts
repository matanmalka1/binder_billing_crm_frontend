import type { PaginatedResponse } from "../types/common";

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

export interface VatPeriodRow {
  period: string;
  status: string;
  total_output_vat: number;
  total_input_vat: number;
  net_vat: number;
  final_vat_amount: number | null;
  filed_at: string | null;
}

export interface VatAnnualSummary {
  year: number;
  total_output_vat: number;
  total_input_vat: number;
  net_vat: number;
  periods_count: number;
  filed_count: number;
}

export interface VatClientSummaryResponse {
  client_id: number;
  periods: VatPeriodRow[];
  annual: VatAnnualSummary[];
}

export interface FileVatReturnPayload {
  filing_method: "manual" | "online";
  override_amount?: string | null;
  override_justification?: string | null;
}
