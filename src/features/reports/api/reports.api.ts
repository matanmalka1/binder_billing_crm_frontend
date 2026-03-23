import { reportsQueriesApi } from "./reports.queries.api";
import { reportsMutationsApi } from "./reports.mutations.api";

export const reportsApi = {
  ...reportsQueriesApi,
  ...reportsMutationsApi,
};
