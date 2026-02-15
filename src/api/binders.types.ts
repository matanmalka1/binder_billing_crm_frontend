import type { BackendActionInput } from "../lib/actions/types";
import type { PaginatedResponse } from "../types/common";

export interface BinderResponse {
  id: number;
  client_id: number;
  binder_number: string;
  status: string;
  received_at: string;
  expected_return_at: string;
  returned_at: string | null;
  pickup_person_name?: string | null;
  days_in_office?: number | null;
  work_state?: string | null;
  sla_state?: string | null;
  signals?: string[] | null;
  available_actions?: BackendActionInput[] | null;
}

export interface BinderListResponse {
  items: BinderResponse[];
}

export interface BinderExtended {
  id: number;
  client_id: number;
  binder_number: string;
  status: string;
  received_at: string;
  expected_return_at: string;
  returned_at: string | null;
  pickup_person_name?: string | null;
  is_overdue: boolean;
  days_overdue: number;
  work_state?: string | null;
  signals?: string[] | null;
}

export type BinderExtendedListResponse = PaginatedResponse<BinderExtended>;

export interface BinderHistoryEntry {
  old_status: string;
  new_status: string;
  changed_by: number;
  changed_at: string;
  notes?: string | null;
}

export interface BinderHistoryResponse {
  binder_id: number;
  history: BinderHistoryEntry[];
}

export interface ListBindersParams {
  status?: string;
  client_id?: number;
  work_state?: string;
  sla_state?: string;
}

export interface ListOperationalBindersParams {
  page?: number;
  page_size?: number;
}

export interface ReceiveBinderPayload {
  client_id: number;
  binder_number: string;
  received_at: string;
  received_by: number;
  notes?: string | null;
}

export interface ReturnBinderPayload {
  pickup_person_name?: string;
  returned_by?: number;
}
