import { ENDPOINTS } from "../endpoints";
import type { EndpointContract } from "../types";

export const CHARGES_DOCUMENTS_CONTRACT_ENTRIES: EndpointContract[] = [
  {
    key: "charges.create",
    method: "POST",
    path: ENDPOINTS.charges,
    role: "advisor",
  },
  {
    key: "charges.list",
    method: "GET",
    path: ENDPOINTS.charges,
    role: "advisor_or_secretary",
    query: ["client_id", "status", "page", "page_size"],
  },
  {
    key: "charges.get",
    method: "GET",
    path: "/charges/{charge_id}",
    role: "advisor_or_secretary",
  },
  {
    key: "charges.issue",
    method: "POST",
    path: "/charges/{charge_id}/issue",
    role: "advisor",
  },
  {
    key: "charges.markPaid",
    method: "POST",
    path: "/charges/{charge_id}/mark-paid",
    role: "advisor",
  },
  {
    key: "charges.cancel",
    method: "POST",
    path: "/charges/{charge_id}/cancel",
    role: "advisor",
  },
  {
    key: "documents.upload",
    method: "POST",
    path: ENDPOINTS.documentsUpload,
    role: "advisor_or_secretary",
  },
  {
    key: "documents.clientList",
    method: "GET",
    path: "/documents/client/{client_id}",
    role: "advisor_or_secretary",
  },
  {
    key: "documents.clientSignals",
    method: "GET",
    path: "/documents/client/{client_id}/signals",
    role: "advisor_or_secretary",
  },
];
