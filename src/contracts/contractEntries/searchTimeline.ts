import { ENDPOINTS } from "../endpoints";
import type { EndpointContract } from "../types";

export const SEARCH_TIMELINE_CONTRACT_ENTRIES: EndpointContract[] = [
  {
    key: "search.global",
    method: "GET",
    path: ENDPOINTS.search,
    role: "advisor_or_secretary",
    query: [
      "query",
      "client_name",
      "id_number",
      "binder_number",
      "work_state",
      "sla_state",
      "signal_type",
      "has_signals",
      "page",
      "page_size",
    ],
  },
  {
    key: "timeline.client",
    method: "GET",
    path: "/clients/{client_id}/timeline",
    role: "advisor_or_secretary",
    query: ["page", "page_size"],
  },
];
