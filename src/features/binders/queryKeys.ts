import { createListDetailKeys } from "../../utils/queryKeys";

export interface BindersListFilters {
  work_state?: string;
  sla_state?: string;
}

export const bindersKeys = createListDetailKeys<BindersListFilters>("binders");
