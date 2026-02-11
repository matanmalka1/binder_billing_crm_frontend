export interface Binder {
  id: number;
  client_id: number;
  binder_number: string;
  status: string;
  received_at: string;
  expected_return_at: string;
  returned_at: string | null;
  days_in_office: number;
  available_actions?: string[];
  work_state?: string | null;
  sla_state?: string | null;
  signals?: string[] | null;
}

export interface BindersListResponse {
  items: Binder[];
}
