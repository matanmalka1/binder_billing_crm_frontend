import { clientsQueriesApi } from "./clients.queries.api";
import { clientsMutationsApi } from "./clients.mutations.api";

export const clientsApi = {
  ...clientsQueriesApi,
  ...clientsMutationsApi,
};
