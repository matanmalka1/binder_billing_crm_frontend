import type { BackendAction } from "@/lib/actions/types";

export interface BinderDetailResponse {
  id: number;
  client_record_id: number;
  office_client_number?: number | null;
  client_name: string | null;
  client_id_number?: string | null;
  binder_number: string;
  period_start: string | null;
  period_end: string | null;
  status: string;
  returned_at: string | null;
  pickup_person_name: string | null;
  days_in_office: number | null;
  available_actions?: BackendAction[];
}

export interface BinderListResponseExtended {
  items: BinderDetailResponse[];
  page: number;
  page_size: number;
  total: number;
}

export interface BinderMarkReadyBulkPayload {
  client_record_id: number;
  until_period_year: number;
  until_period_month: number;
}

export interface BinderHandoverPayload {
  client_record_id: number;
  binder_ids: number[];
  received_by_name: string;
  handed_over_at: string;
  until_period_year: number;
  until_period_month: number;
  notes?: string | null;
}

export interface BinderHandoverResponse {
  id: number;
  client_record_id: number;
  received_by_name: string;
  handed_over_at: string;
  until_period_year: number;
  until_period_month: number;
  binder_ids: number[];
  notes?: string | null;
  created_at: string;
}
