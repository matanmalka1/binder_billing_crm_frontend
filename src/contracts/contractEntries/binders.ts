import { ENDPOINTS, endpointTemplate } from "../endpoints";
import type { EndpointContract } from "../types";

export const BINDERS_CONTRACT_ENTRIES: EndpointContract[] = [
  {
    key: "binders.receive",
    method: "POST",
    path: ENDPOINTS.binderReceive,
    role: "advisor_or_secretary",
  },
  {
    key: "binders.ready",
    method: "POST",
    path: endpointTemplate("binderReady"),
    role: "advisor_or_secretary",
  },
  {
    key: "binders.return",
    method: "POST",
    path: endpointTemplate("binderReturn"),
    role: "advisor_or_secretary",
  },
  {
    key: "binders.list",
    method: "GET",
    path: ENDPOINTS.binders,
    role: "advisor_or_secretary",
    query: ["status", "client_id", "work_state", "sla_state"],
  },
  {
    key: "binders.get",
    method: "GET",
    path: endpointTemplate("binderById"),
    role: "advisor_or_secretary",
  },
  {
    key: "binders.open",
    method: "GET",
    path: ENDPOINTS.bindersOpen,
    role: "advisor_or_secretary",
    query: ["page", "page_size"],
  },
  {
    key: "binders.overdue",
    method: "GET",
    path: ENDPOINTS.bindersOverdue,
    role: "advisor_or_secretary",
    query: ["page", "page_size"],
  },
  {
    key: "binders.dueToday",
    method: "GET",
    path: ENDPOINTS.bindersDueToday,
    role: "advisor_or_secretary",
    query: ["page", "page_size"],
  },
  {
    key: "binders.byClient",
    method: "GET",
    path: endpointTemplate("clientBinders"),
    role: "advisor_or_secretary",
    query: ["page", "page_size"],
  },
  {
    key: "binders.history",
    method: "GET",
    path: endpointTemplate("binderHistory"),
    role: "advisor_or_secretary",
  },
];
