import type { BackendAction } from "../lib/actions/types";
import { ENDPOINTS } from "./endpoints";
import type { PaginatedResponse } from "../types/common";
import { toQueryParams } from "./queryParams";
import { api } from "./client";

/** ISO-8601 calendar date string `YYYY-MM-DD`. */
export type ISODateString = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export interface ClientResponse {
  id: number;
  full_name: string;
  id_number: string;
  client_type: string;
  status: string;
  primary_binder_number: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  address: string | null;
  business_sector: string | null;
  opened_at: ISODateString;
  closed_at: string | null;
  available_actions?: BackendAction[] | null;
}

export type ClientListResponse = PaginatedResponse<ClientResponse>;

export interface ListClientsParams {
  status?: string;
  has_signals?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateClientPayload {
  full_name: string;
  id_number: string;
  client_type: string;
  phone?: string | null;
  email?: string | null;
  /** Calendar date in `YYYY-MM-DD` format. */
  opened_at: ISODateString;
}

export interface UpdateClientPayload {
  full_name?: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  status?: string;
  client_type?: string;
  primary_binder_number?: string | null;
  address?: string | null;
  business_sector?: string | null;
}

export interface VatSummaryCard {
  net_vat_total: number;
  periods_filed: number;
  periods_total: number;
  latest_period: string | null;
}

export interface AnnualReportCard {
  status: string | null;
  form_type: string | null;
  filing_deadline: string | null;
  refund_due: number | null;
  tax_due: number | null;
}

export interface ChargesCard {
  total_outstanding: number;
  unpaid_count: number;
}

export interface AdvancePaymentsCard {
  total_paid: number;
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

export interface ClientStatusCardResponse {
  client_id: number;
  year: number;
  vat: VatSummaryCard;
  annual_report: AnnualReportCard;
  charges: ChargesCard;
  advance_payments: AdvancePaymentsCard;
  binders: BindersCard;
  documents: DocumentsCard;
}

export const clientsApi = {
  list: async (params: ListClientsParams): Promise<ClientListResponse> => {
    const response = await api.get<ClientListResponse>(ENDPOINTS.clients, {
      params: toQueryParams(params),
    });
    return response.data;
  },

  getById: async (clientId: number): Promise<ClientResponse> => {
    const response = await api.get<ClientResponse>(
      ENDPOINTS.clientById(clientId),
    );
    return response.data;
  },

  create: async (payload: CreateClientPayload): Promise<ClientResponse> => {
    const response = await api.post<ClientResponse>(ENDPOINTS.clients, payload);
    return response.data;
  },

  update: async (
    clientId: number,
    payload: UpdateClientPayload,
  ): Promise<ClientResponse> => {
    const response = await api.patch<ClientResponse>(
      ENDPOINTS.clientById(clientId),
      payload,
    );
    return response.data;
  },

  getStatusCard: async (clientId: number): Promise<ClientStatusCardResponse> => {
    const response = await api.get<ClientStatusCardResponse>(
      ENDPOINTS.clientStatusCard(clientId),
    );
    return response.data;
  },
};
