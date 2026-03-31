import type { BackendAction } from "@/lib/actions/types";

export interface BinderDetailResponse {
  id: number;
  client_id: number;
  client_name: string | null;
  binder_number: string;
  period_start: string | null;
  period_end: string | null;
  status: string;
  returned_at: string | null;
  pickup_person_name: string | null;
  notes: string | null;
  created_at: string;
  days_in_office: number | null;
  signals: string[];
  available_actions?: BackendAction[];
}

export interface BinderListResponseExtended {
  items: BinderDetailResponse[];
  page: number;
  page_size: number;
  total: number;
}
