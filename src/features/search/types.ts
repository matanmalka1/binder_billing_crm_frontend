import type { SearchResponse, SearchResult } from "../../api/search.api";

export type { SearchResponse, SearchResult };

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
