// Public surface of the clients feature — only import from this barrel externally
export { clientsApi, clientsQK } from "./api";
export { CLIENT_ENDPOINTS, CLIENT_ROUTES } from "./api/endpoints";
export { ClientEditForm } from "./components/ClientEditForm";
export { buildClientColumns } from "./components/ClientColumns";
export { ClientDetailsTabContent } from "./components/ClientDetailsTabContent";
export { ClientsFiltersBar } from "./components/ClientsFiltersBar";
export { CreateClientModal } from "./components/CreateClientModal";
export { DeletedClientDialog } from "./components/DeletedClientDialog";
export { useClientDetails } from "./hooks/useClientDetails";
export { useClientsPage } from "./hooks/useClientsPage";
export { useFirstBusinessId } from "./hooks/useFirstBusinessId";
export {
  BUSINESS_STATUS_LABELS,
} from "./constants";
export { ClientDetails } from "./pages/ClientDetailsPage";
export { Clients } from "./pages/ClientsPage";
export type {
  ClientResponse,
  BusinessResponse,
  BusinessWithClientResponse,
  BusinessListResponse,
  BusinessStatus,
  VatType,
  ISODateString,
} from "./api";
