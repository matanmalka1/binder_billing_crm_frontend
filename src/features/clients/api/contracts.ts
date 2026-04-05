import type { BackendAction } from "@/lib/actions/types";
import type { PaginatedResponse } from "@/types";

/** ISO-8601 calendar date string `YYYY-MM-DD`. */
export type ISODateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export interface ClientResponse {
  id: number;
  full_name: string;
  id_number: string;
  id_number_type: "individual" | "corporation" | "passport" | "other" | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  address_street: string | null;
  address_building_number: string | null;
  address_apartment: string | null;
  address_city: string | null;
  address_zip_code: string | null;
  created_at: string;
  updated_at: string | null;
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
  page?: number;
  page_size?: number;
}

export interface CreateClientPayload {
  full_name: string;
  id_number: string;
  id_number_type?: "individual" | "corporation" | "passport" | "other";
  phone?: string | null;
  email?: string | null;
  address_street?: string | null;
  address_building_number?: string | null;
  address_apartment?: string | null;
  address_city?: string | null;
  address_zip_code?: string | null;
}

export type BulkClientActionPayload = never;
export type DeletedClientInfo = DeletedClientSummary;

export interface UpdateClientPayload {
  full_name?: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  address_street?: string | null;
  address_building_number?: string | null;
  address_apartment?: string | null;
  address_city?: string | null;
  address_zip_code?: string | null;
}

export type BusinessType = "osek_patur" | "osek_murshe" | "company" | "employee";
export type BusinessStatus = "active" | "frozen" | "closed";

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
