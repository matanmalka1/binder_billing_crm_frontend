import { ENDPOINTS, endpointTemplate } from "../endpoints";
import type { EndpointContract } from "../types";

export const CLIENTS_CONTRACT_ENTRIES: EndpointContract[] = [
  {
    key: "clients.create",
    method: "POST",
    path: ENDPOINTS.clients,
    role: "advisor_or_secretary",
  },
  {
    key: "clients.list",
    method: "GET",
    path: ENDPOINTS.clients,
    role: "advisor_or_secretary",
    query: ["status", "has_signals", "page", "page_size"],
  },
  {
    key: "clients.get",
    method: "GET",
    path: endpointTemplate("clientById"),
    role: "advisor_or_secretary",
  },
  {
    key: "clients.patch",
    method: "PATCH",
    path: endpointTemplate("clientById"),
    role: "advisor_or_secretary",
  },
];
