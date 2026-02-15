import type { ListBindersParams } from "../../api/binders.types";

export type BindersFilters = ListBindersParams;

export interface BindersFiltersBarProps {
  filters: BindersFilters;
  onFilterChange: (name: keyof BindersFilters, value: string) => void;
}
