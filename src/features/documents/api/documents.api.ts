import { documentsQueriesApi } from "./documents.queries.api";
import { documentsMutationsApi } from "./documents.mutations.api";

export const documentsApi = {
  ...documentsQueriesApi,
  ...documentsMutationsApi,
};
