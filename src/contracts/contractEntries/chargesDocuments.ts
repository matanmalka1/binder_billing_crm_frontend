import { ENDPOINTS, endpointTemplate } from "../endpoints";
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
    path: endpointTemplate("chargeById"),
    role: "advisor_or_secretary",
  },
  {
    key: "charges.issue",
    method: "POST",
    path: endpointTemplate("chargeIssue"),
    role: "advisor",
  },
  {
    key: "charges.markPaid",
    method: "POST",
    path: endpointTemplate("chargeMarkPaid"),
    role: "advisor",
  },
  {
    key: "charges.cancel",
    method: "POST",
    path: endpointTemplate("chargeCancel"),
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
    path: endpointTemplate("documentsByClient"),
    role: "advisor_or_secretary",
  },
  {
    key: "documents.clientSignals",
    method: "GET",
    path: endpointTemplate("documentSignalsByClient"),
    role: "advisor_or_secretary",
  },
];
