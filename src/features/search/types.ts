import type { SearchParams } from "./api";

export interface SearchFilters extends Omit<SearchParams, "has_signals" | "signal_type"> {
  query: string;
  client_name: string;
  id_number: string;
  binder_number: string;
  signal_type: string[];
  has_signals: string;
  page: number;
  page_size: number;
}

export interface SearchFiltersBarProps {
  filters: SearchFilters;
  onFilterChange: (name: keyof SearchFilters, value: string | string[]) => void;
  onReset?: () => void;
}
