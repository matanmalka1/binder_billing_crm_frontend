// Public surface of the documents feature
export { documentsApi, documentsQK } from "./api";
export { ClientDocumentsTab } from "./components/ClientDocumentsTab";
export { DOC_TYPE_LABELS, STATUS_LABELS, STATUS_BADGE_VARIANT } from "./documents.constants";
export type {
  PermanentDocumentResponse,
  PermanentDocumentListResponse,
  DocumentVersionsResponse,
  OperationalSignalsResponse,
  UploadDocumentPayload,
  ListDocumentsByClientParams,
} from "./api";
