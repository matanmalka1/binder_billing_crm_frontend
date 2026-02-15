export interface BindersListFilters {
  work_state?: string;
  sla_state?: string;
}

export const bindersKeys = {
  list: (filters: BindersListFilters) => ["binders", "list", filters] as const,
  detail: (id: number) => ["binders", "detail", id] as const,
  lists: () => ["binders", "list"] as const,
};
