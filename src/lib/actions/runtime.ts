import { api } from "../../api/client";
import type { ActionCommand } from "./types";

export const executeAction = async (command: ActionCommand) => {
  return api.request({
    url: command.endpoint,
    method: command.method,
    data: command.payload,
  });
};
