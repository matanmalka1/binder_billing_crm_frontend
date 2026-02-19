import type { ListBindersParams } from "../../api/binders.types";

export type BindersFilters = ListBindersParams;

export interface BindersFiltersBarProps {
  filters: BindersFilters;
  onFilterChange: (name: keyof BindersFilters, value: string) => void;
}

export interface ReceiveBinderFormValues {
  client_id: number;
  binder_type: string;
  binder_number: string;
  received_at: string;
}
