import type { PaginatedResponse } from "@/types";

export interface VatWorkItemResponse {
  id: number;
  business_id: number;
  client_id: number | null;
  business_name: string | null;
  business_status: string | null;
  period: string;
  period_type: string | null;
  status: string;
  pending_materials_note: string | null;
  total_output_vat: string;
  total_input_vat: string;
  net_vat: string;
  total_output_net: string;
  total_input_net: string;
  final_vat_amount: string | null;
  is_overridden: boolean;
  override_justification: string | null;
  submission_method: string | null;
  filed_at: string | null;
  filed_by: number | null;
  filed_by_name?: string | null;
  created_by: number;
  assigned_to: number | null;
  assigned_to_name?: string | null;
  created_at: string;
  updated_at: string;
  submission_reference: string | null;
  is_amendment: boolean;
  amends_item_id: number | null;
  submission_deadline: string | null;
  days_until_deadline: number | null;
  is_overdue: boolean | null;
}

export type VatWorkItemListResponse = PaginatedResponse<VatWorkItemResponse>;

export interface VatWorkItemsListParams {
  status?: string;
  page?: number;
  page_size?: number;
  period?: string;
  client_name?: string;
}

export interface VatWorkItemLookupResponse {
  id: number;
  status: string;
  period: string;
}

export interface VatPeriodOptionResponse {
  period: string;
  label: string;
  start_month: number;
  end_month: number;
  is_opened: boolean;
}

export interface VatPeriodOptionsResponse {
  business_id: number;
  year: number;
  period_type: "monthly" | "bimonthly" | "exempt";
  options: VatPeriodOptionResponse[];
}

export interface CreateVatWorkItemPayload {
  business_id: number;
  period: string;
  assigned_to?: number | null;
  mark_pending?: boolean;
  pending_materials_note?: string | null;
}

export interface VatInvoiceResponse {
  id: number;
  work_item_id: number;
  invoice_type: string;
  document_type: string | null;
  invoice_number: string;
  invoice_date: string;
  counterparty_name: string;
  counterparty_id: string | null;
  counterparty_id_type: string | null;
  net_amount: string;
  vat_amount: string;
  expense_category: string | null;
  rate_type: string;
  deduction_rate: string;
  is_exceptional: boolean;
  created_by: number;
  created_at: string;
}

export interface VatInvoiceListResponse {
  items: VatInvoiceResponse[];
}

export interface CreateVatInvoicePayload {
  invoice_type: "income" | "expense";
  invoice_number?: string;
  invoice_date?: string;
  counterparty_name?: string;
  net_amount: string;
  vat_amount: string;
  counterparty_id?: string | null;
  counterparty_id_type?: string | null;
  expense_category?: string | null;
  rate_type?: string;
  document_type?: string | null;
}

export interface UpdateVatInvoicePayload {
  net_amount?: string;
  vat_amount?: string;
  invoice_number?: string;
  invoice_date?: string;
  counterparty_name?: string;
  counterparty_id?: string | null;
  counterparty_id_type?: string | null;
  expense_category?: string | null;
  rate_type?: string;
  document_type?: string | null;
}

export interface VatAuditLogResponse {
  id: number;
  work_item_id: number;
  performed_by: number;
  performed_by_name?: string | null;
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
  work_item_id: number;
  period: string;
  status: string;
  total_output_vat: string;
  total_input_vat: string;
  net_vat: string;
  total_output_net: string;
  total_input_net: string;
  final_vat_amount: string | null;
  filed_at: string | null;
}

export interface VatAnnualSummary {
  year: number;
  total_output_vat: string;
  total_input_vat: string;
  net_vat: string;
  periods_count: number;
  filed_count: number;
}

export interface VatClientSummaryResponse {
  business_id: number;
  periods: VatPeriodRow[];
  annual: VatAnnualSummary[];
}

export interface FileVatReturnPayload {
  submission_method: "manual" | "online";
  override_amount?: string | null;
  override_justification?: string | null;
  submission_reference?: string;
  is_amendment?: boolean;
  amends_item_id?: number | null;
}
