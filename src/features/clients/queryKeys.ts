import type { ListClientsParams } from "../../api/clients.api";

export const clientsKeys = {
  all: ["clients"] as const,
  lists: () => [...clientsKeys.all, "list"] as const,
  list: (filters: ListClientsParams) => [...clientsKeys.lists(), filters] as const,
  details: () => [...clientsKeys.all, "detail"] as const,
  detail: (id: number) => [...clientsKeys.details(), id] as const,
};
