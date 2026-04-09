import type { BackendAction } from "@/lib/actions/types";
import type { PaginatedResponse } from "@/types";

/** ISO-8601 calendar date string `YYYY-MM-DD`. */
export type ISODateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export interface ClientResponse {
  id: number;
  full_name: string;
  id_number: string;
  id_number_type: "individual" | "corporation" | "passport" | "other" | null;
  entity_type: EntityType | null;
  status: ClientStatus;
  phone: string | null;
  email: string | null;
  notes: string | null;
  address_street: string | null;
  address_building_number: string | null;
  address_apartment: string | null;
  address_city: string | null;
  address_zip_code: string | null;
  // Tax profile fields (formerly BusinessTaxProfile)
  vat_reporting_frequency: VatType | null;
  vat_start_date: string | null;
  vat_exempt_ceiling: string | null;
  advance_rate: string | null;
  advance_rate_updated_at: string | null;
  accountant_name: string | null;
  business_type_label: string | null;
  fiscal_year_start_month: number;
  tax_year_start: number | null;
  created_at: string;
  updated_at: string | null;
  active_binder_number: string | null;
}

export interface ActiveClientSummary {
  id: number;
  full_name: string;
  id_number: string;
}

export interface DeletedClientSummary {
  id: number;
  full_name: string;
  id_number: string;
  deleted_at: string;
}

export interface ClientConflictInfo {
  id_number: string;
  active_clients: ActiveClientSummary[];
  deleted_clients: DeletedClientSummary[];
}

export type ClientListResponse = PaginatedResponse<ClientResponse>;

export interface ListClientsParams {
  search?: string;
  status?: ClientStatus;
  sort_by?: "full_name" | "created_at" | "status";
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface CreateClientPayload {
  full_name: string;
  id_number: string;
  id_number_type?: "individual" | "corporation" | "passport" | "other";
  entity_type?: EntityType | null;
  phone?: string | null;
  email?: string | null;
  address_street?: string | null;
  address_building_number?: string | null;
  address_apartment?: string | null;
  address_city?: string | null;
  address_zip_code?: string | null;
  vat_reporting_frequency?: VatType | null;
  vat_start_date?: string | null;
  vat_exempt_ceiling?: string | null;
  advance_rate?: string | null;
  advance_rate_updated_at?: string | null;
  accountant_name?: string | null;
  business_type_label?: string | null;
  fiscal_year_start_month?: number | null;
  tax_year_start?: number | null;
}

export type BulkClientActionPayload = never;
export type DeletedClientInfo = DeletedClientSummary;

export interface UpdateClientPayload {
  full_name?: string;
  status?: ClientStatus;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  address_street?: string | null;
  address_building_number?: string | null;
  address_apartment?: string | null;
  address_city?: string | null;
  address_zip_code?: string | null;
  vat_reporting_frequency?: VatType | null;
  vat_start_date?: string | null;
  vat_exempt_ceiling?: string | null;
  advance_rate?: string | null;
  advance_rate_updated_at?: string | null;
  accountant_name?: string | null;
  business_type_label?: string | null;
  fiscal_year_start_month?: number | null;
  tax_year_start?: number | null;
}

export type BusinessType = "osek_patur" | "osek_murshe" | "company" | "employee";
export type EntityType = "osek_patur" | "osek_murshe" | "company_ltd" | "employee";
export type BusinessStatus = "active" | "frozen" | "closed";
export type ClientStatus = "active" | "frozen" | "closed";
export type VatType = "monthly" | "bimonthly" | "exempt";

export interface BusinessResponse {
  id: number;
  client_id: number;
  business_name: string | null;
  business_type: BusinessType;
  status: BusinessStatus;
  opened_at: ISODateString;
  closed_at: string | null;
  notes: string | null;
  created_at: string | null;
  available_actions?: BackendAction[] | null;
}

export interface BusinessWithClientResponse extends BusinessResponse {
  client_full_name: string;
  client_id_number: string;
}

export type BusinessListResponse = PaginatedResponse<BusinessWithClientResponse>;
export type ClientBusinessesResponse = {
  client_id: number;
  items: BusinessResponse[];
  page: number;
  page_size: number;
  total: number;
};

export interface ListBusinessesParams {
  status?: BusinessStatus;
  business_type?: BusinessType;
  has_signals?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateBusinessPayload {
  business_type: BusinessType;
  opened_at: ISODateString;
  business_name?: string | null;
  notes?: string | null;
  tax_id_number?: string | null;
}

export interface UpdateBusinessPayload {
  business_name?: string | null;
  business_type?: BusinessType;
  status?: BusinessStatus;
  notes?: string | null;
  closed_at?: string | null;
}

export interface EntityAuditLogEntry {
  id: number;
  entity_type: string;
  entity_id: number;
  performed_by: number;
  performed_by_name: string | null;
  action: string;
  old_value: string | null;
  new_value: string | null;
  note: string | null;
  performed_at: string;
}

export interface EntityAuditTrailResponse {
  items: EntityAuditLogEntry[];
}

export interface VatSummaryCard {
  net_vat_total: string;
  periods_filed: number;
  periods_total: number;
  latest_period: string | null;
}

export interface AnnualReportCard {
  status: string | null;
  form_type: string | null;
  filing_deadline: string | null;
  refund_due: string | null;
  tax_due: string | null;
}

export interface ChargesCard {
  total_outstanding: string;
  unpaid_count: number;
}

export interface AdvancePaymentsCard {
  total_paid: string;
  count: number;
}

export interface BindersCard {
  active_count: number;
  in_office_count: number;
}

export interface DocumentsCard {
  total_count: number;
  present_count: number;
}

export interface BusinessStatusCardResponse {
  client_id: number;
  business_id: number;
  year: number;
  vat: VatSummaryCard;
  annual_report: AnnualReportCard;
  charges: ChargesCard;
  advance_payments: AdvancePaymentsCard;
  binders: BindersCard;
  documents: DocumentsCard;
}
