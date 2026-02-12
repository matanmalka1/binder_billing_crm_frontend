export interface SearchResult {
  result_type: string;
  client_id: number;
  client_name: string;
  binder_id: number | null;
  binder_number: string | null;
  work_state?: string | null;
  sla_state?: string | null;
  signals?: string[] | null;
}

export interface SearchResponse {
  results: SearchResult[];
  page: number;
  page_size: number;
  total: number;
}

export interface SearchFilters {
  query: string;
  client_name: string;
  id_number: string;
  binder_number: string;
  work_state: string;
  sla_state: string;
  signal_type: string[];
  has_signals: string;
  page: number;
  page_size: number;
}
