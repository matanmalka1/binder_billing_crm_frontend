import type { SearchParams } from "../../api/search.api";

export const searchKeys = {
  all: ["search"] as const,
  results: () => [...searchKeys.all, "results"] as const,
  result: (filters: SearchParams) => [...searchKeys.results(), filters] as const,
};
