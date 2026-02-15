import type { ListClientsParams } from "../../api/clients.api";

export const clientsKeys = {
  list: (filters: ListClientsParams) => ["clients", "list", filters] as const,
  detail: (id: number) => ["clients", "detail", id] as const,
  lists: () => ["clients", "list"] as const,
};
