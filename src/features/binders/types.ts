import type { BackendAction } from "../../lib/actions/types";

export interface BinderResponse {
  id: number;
  client_id: number;
  client_name: string | null;
  binder_number: string;
  period_start: string | null;
  period_end: string | null;
  status: string;
  returned_at: string | null;
  pickup_person_name?: string | null;
  days_in_office?: number | null;
  is_full: boolean;
  available_actions?: BackendAction[] | null;
}

export interface BinderListResponse {
  items: BinderResponse[];
  page: number;
  page_size: number;
  total: number;
}

export interface BinderHistoryEntry {
  old_status: string;
  new_status: string;
  changed_by: number;
  changed_by_name?: string | null;
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
  query?: string;
  client_name?: string;
  binder_number?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_dir?: string;
  year?: number;
}

export interface ListOperationalBindersParams {
  page?: number;
  page_size?: number;
}

export interface ReceiveBinderPayload {
  client_id: number;
  received_at: string;
  received_by: number;
  open_new_binder?: boolean;
  notes?: string | null;
  materials?: {
    material_type: string;
    business_id?: number | null;
    annual_report_id?: number | null;
    description?: string | null;
  }[];
}

export interface ReturnBinderPayload {
  pickup_person_name?: string;
  returned_by?: number;
}

export type BindersFilters = Omit<ListBindersParams, "client_name" | "binder_number" | "year"> & {
  year?: string;
};

export interface BindersFiltersBarProps {
  filters: BindersFilters;
  onFilterChange: (name: string, value: string) => void;
}

export interface BinderIntakeMaterialResponse {
  id: number;
  intake_id: number;
  material_type: string;
  business_id?: number | null;
  annual_report_id?: number | null;
  description?: string | null;
  created_at: string;
}

export interface BinderIntakeResponse {
  id: number;
  binder_id: number;
  received_at: string;
  received_by: number;
  received_by_name?: string | null;
  notes?: string | null;
  created_at: string;
  materials: BinderIntakeMaterialResponse[];
}

export interface BinderIntakeListResponse {
  binder_id: number;
  intakes: BinderIntakeResponse[];
}

export interface BinderReceiveResult {
  binder: BinderResponse;
  intake: BinderIntakeResponse;
  is_new_binder: boolean;
}
