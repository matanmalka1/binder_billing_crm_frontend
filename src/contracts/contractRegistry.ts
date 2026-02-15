import { AUTH_HEALTH_CONTRACT_ENTRIES } from "./contractEntries/authHealth";
import { BINDERS_CONTRACT_ENTRIES } from "./contractEntries/binders";
import { CHARGES_DOCUMENTS_CONTRACT_ENTRIES } from "./contractEntries/chargesDocuments";
import { CLIENTS_CONTRACT_ENTRIES } from "./contractEntries/clients";
import { DASHBOARD_CONTRACT_ENTRIES } from "./contractEntries/dashboard";
import { SEARCH_TIMELINE_CONTRACT_ENTRIES } from "./contractEntries/searchTimeline";
import type { EndpointContract } from "./types";

export const BACKEND_CONTRACT: EndpointContract[] = [
  ...AUTH_HEALTH_CONTRACT_ENTRIES,
  ...CLIENTS_CONTRACT_ENTRIES,
  ...BINDERS_CONTRACT_ENTRIES,
  ...DASHBOARD_CONTRACT_ENTRIES,
  ...SEARCH_TIMELINE_CONTRACT_ENTRIES,
  ...CHARGES_DOCUMENTS_CONTRACT_ENTRIES,
];
