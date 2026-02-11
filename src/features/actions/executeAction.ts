import { api } from "../../api/client";
import type { ResolvedBackendAction } from "./types";

export const executeBackendAction = async (action: ResolvedBackendAction) => {
  if (!action.endpoint) {
    throw new Error("הפעולה אינה זמינה כרגע");
  }
  return api.request({
    url: action.endpoint,
    method: action.method,
    data: action.payload,
  });
};
