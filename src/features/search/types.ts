import type { SearchResult, SearchParams } from "../../api/search.api";

export interface SearchFilters extends Omit<SearchParams, "has_signals" | "signal_type"> {
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

export interface SearchContentProps {
  total: number;
  filters: SearchFilters;
  results: SearchResult[];
  onFilterChange: (name: keyof SearchFilters, value: string | string[]) => void;
}

export interface SearchFiltersBarProps {
  filters: SearchFilters;
  onFilterChange: (name: keyof SearchFilters, value: string | string[]) => void;
}

export interface SearchTableProps {
  results: SearchResult[];
}
