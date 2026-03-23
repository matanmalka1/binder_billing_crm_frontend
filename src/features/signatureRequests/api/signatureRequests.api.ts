import { signatureRequestsQueriesApi } from "./signatureRequests.queries.api";
import { signatureRequestsMutationsApi } from "./signatureRequests.mutations.api";

export const signatureRequestsApi = {
  ...signatureRequestsQueriesApi,
  ...signatureRequestsMutationsApi,
};
