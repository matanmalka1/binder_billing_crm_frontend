export interface BindersFilters {
  work_state: string;
  sla_state: string;
}

export interface BindersFiltersBarProps {
  filters: BindersFilters;
  onFilterChange: (name: keyof BindersFilters, value: string) => void;
}
