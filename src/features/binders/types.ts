import type { BinderResponse } from "../../api/binders.types";
import type { ActionCommand } from "../../lib/actions/types";

export interface BindersFilters {
  work_state: string;
  sla_state: string;
}

export interface BindersFiltersBarProps {
  filters: BindersFilters;
  onFilterChange: (name: keyof BindersFilters, value: string) => void;
}

export interface BindersTableCardProps {
  binders: BinderResponse[];
  activeActionKey: string | null;
  onActionClick: (action: ActionCommand) => void;
}

export interface BindersTableRowProps {
  binder: BinderResponse;
  activeActionKey: string | null;
  onActionClick: (action: ActionCommand) => void;
}
