// Public surface of the clients feature — only import from this barrel externally
export { clientsApi, clientsQK } from "./api";
export { buildClientColumns } from "./components/ClientColumns";
export { ClientDetailsTabContent } from "./components/ClientDetailsTabContent";
export { ClientsFiltersBar } from "./components/ClientsFiltersBar";
export { CreateClientModal } from "./components/CreateClientModal";
export { DeletedClientDialog } from "./components/DeletedClientDialog";
export { useClientDetails } from "./hooks/useClientDetails";
export { useClientsPage } from "./hooks/useClientsPage";
export { ClientDetails } from "./pages/ClientDetailsPage";
export { Clients } from "./pages/ClientsPage";
export type {
  ClientResponse,
  BusinessResponse,
  BusinessWithClientResponse,
  BusinessListResponse,
  BusinessStatus,
  BusinessType,
  ISODateString,
} from "./api";
