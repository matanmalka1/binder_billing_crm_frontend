import type { SearchParams } from "./api";

export interface SearchFilters extends Required<SearchParams> {
  page: number;
  page_size: number;
}

export interface SearchFiltersBarProps {
  filters: SearchFilters;
  onFilterChange: (name: keyof SearchFilters, value: string) => void;
  onReset?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}
