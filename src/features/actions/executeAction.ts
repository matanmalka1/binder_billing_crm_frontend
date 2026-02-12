import type { ResolvedBackendAction } from "./types";
import { executeApiAction, validateActionBeforeRequest } from "../../services/actionService";

export const executeBackendAction = async (action: ResolvedBackendAction) => {
  validateActionBeforeRequest({
    token: action.token,
    endpoint: action.endpoint,
    payload: action.payload,
  });
  return executeApiAction({
    endpoint: action.endpoint,
    method: action.method,
    payload: action.payload,
  });
};
