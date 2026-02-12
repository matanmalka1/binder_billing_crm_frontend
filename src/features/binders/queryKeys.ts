export interface BindersListFilters {
  work_state?: string;
  sla_state?: string;
}

export const bindersKeys = {
  all: ["binders"] as const,
  lists: () => [...bindersKeys.all, "list"] as const,
  list: (filters: BindersListFilters) => [...bindersKeys.lists(), filters] as const,
  details: () => [...bindersKeys.all, "detail"] as const,
  detail: (id: number) => [...bindersKeys.details(), id] as const,
};
