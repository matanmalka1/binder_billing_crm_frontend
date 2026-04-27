import { DOC_TYPE_LABELS } from "../documents.constants";
import type {
  OperationalSignalsResponse,
  PermanentDocumentResponse,
} from "../api";

export const getDocumentTypeLabel = (
  documentType: PermanentDocumentResponse["document_type"] | string,
) => DOC_TYPE_LABELS[documentType] ?? documentType;

export const getMissingDocumentsMessage = (
  missingDocuments: OperationalSignalsResponse["missing_documents"],
) => `מסמכים חסרים: ${missingDocuments.map(getDocumentTypeLabel).join(", ")}`;

const matchesDocumentSearch = (
  doc: PermanentDocumentResponse,
  searchTerm: string,
) => {
  if (!searchTerm) return true;
  const query = searchTerm.toLowerCase();
  const filename = (doc.original_filename ?? "").toLowerCase();
  const documentType = getDocumentTypeLabel(doc.document_type).toLowerCase();

  return filename.includes(query) || documentType.includes(query);
};

export const filterDocuments = (
  documents: PermanentDocumentResponse[],
  searchTerm: string,
  documentType: string,
) =>
  documents.filter((doc) => {
    if (documentType && doc.document_type !== documentType) return false;
    return matchesDocumentSearch(doc, searchTerm);
  });

export const getCountLabel = (filteredCount: number, totalCount: number) =>
  filteredCount !== totalCount
    ? `${filteredCount}/${totalCount}`
    : `${totalCount}`;
