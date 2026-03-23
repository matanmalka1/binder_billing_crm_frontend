// INFRASTRUCTURE LAYER: Pure HTTP execution. No React, no hooks.
// Consumer: features/actions/hooks only. Do not import from here outside of features/actions.
import { api } from "../../api/client";
import { ACTION_ENDPOINT_PATTERNS } from "../../api/endpoints";
import type { ActionCommand } from "./types";

const isAllowedActionEndpoint = (endpoint: string): boolean =>
  ACTION_ENDPOINT_PATTERNS.some((pattern) => pattern.test(endpoint));

export const executeAction = async (command: ActionCommand) => {
  if (!isAllowedActionEndpoint(command.endpoint)) {
    console.error(`Blocked action with unrecognised endpoint: ${command.endpoint}`);
    throw new Error(`פעולה לא מורשית: ${command.endpoint}`);
  }

  return api.request({
    url: command.endpoint,
    method: command.method,
    data: command.payload,
  });
};
