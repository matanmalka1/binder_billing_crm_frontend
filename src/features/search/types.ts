import type { SearchParams } from "./api";

export interface SearchFilters extends SearchParams {
  query: string;
  client_name: string;
  id_number: string;
  binder_number: string;
  page: number;
  page_size: number;
}

export interface SearchFiltersBarProps {
  filters: SearchFilters;
  onFilterChange: (name: keyof SearchFilters, value: string) => void;
  onReset?: () => void;
}
