export interface SearchResult {
  result_type: string;
  client_id: number | null;
  client_name: string | null;
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
  work_state: string;
  sla_state: string;
  signal_type: string;
}
