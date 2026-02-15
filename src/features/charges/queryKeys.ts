import type { ChargesListParams } from "../../api/charges.api";

export const chargesKeys = {
  list: (filters: ChargesListParams) => ["charges", "list", filters] as const,
  detail: (id: number) => ["charges", "detail", id] as const,
  lists: () => ["charges", "list"] as const,
};
