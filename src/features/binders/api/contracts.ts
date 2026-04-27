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
}

import type { PaginatedResponse } from "@/types";

export type BinderListResponseExtended = PaginatedResponse<BinderDetailResponse>;

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
