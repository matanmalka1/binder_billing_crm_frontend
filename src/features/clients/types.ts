import type { BackendActionInput } from "../actions/types";

export interface Client {
  id: number;
  full_name: string;
  id_number: string;
  client_type: string;
  status: string;
  phone: string | null;
  email: string | null;
  opened_at: string;
  closed_at?: string | null;
  available_actions?: BackendActionInput[] | null;
}

export interface ClientsListResponse {
  items: Client[];
  page: number;
  page_size: number;
  total: number;
}
