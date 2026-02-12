import { ENDPOINTS } from "../endpoints";
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
    path: "/binders/{binder_id}/ready",
    role: "advisor_or_secretary",
  },
  {
    key: "binders.return",
    method: "POST",
    path: "/binders/{binder_id}/return",
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
    path: "/binders/{binder_id}",
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
    path: "/clients/{client_id}/binders",
    role: "advisor_or_secretary",
    query: ["page", "page_size"],
  },
  {
    key: "binders.history",
    method: "GET",
    path: "/binders/{binder_id}/history",
    role: "advisor_or_secretary",
  },
];
