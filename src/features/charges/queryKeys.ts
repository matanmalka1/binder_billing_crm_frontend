import type { ChargesListParams } from "../../api/charges.api";

export const chargesKeys = {
  all: ["charges"] as const,
  lists: () => [...chargesKeys.all, "list"] as const,
  list: (filters: ChargesListParams) => [...chargesKeys.lists(), filters] as const,
  details: () => [...chargesKeys.all, "detail"] as const,
  detail: (id: number) => [...chargesKeys.details(), id] as const,
};
