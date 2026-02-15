import { ENDPOINTS } from "../../api/endpoints";
import { api } from "../../api/client";
import { hasValidReceivePayload } from "./catalog";
import type { ActionCommand } from "./types";

const validateActionBeforeRequest = (command: ActionCommand) => {
  const isReceiveAction =
    command.id === "receive" || command.endpoint === ENDPOINTS.binderReceive;
  if (isReceiveAction && !hasValidReceivePayload(command.payload)) {
    throw new Error("פעולת קליטת תיק דורשת client_id ו-binder_number");
  }
};

export const executeAction = async (command: ActionCommand) => {
  validateActionBeforeRequest(command);
  return api.request({
    url: command.endpoint,
    method: command.method,
    data: command.payload,
  });
};
