import { useMemo, useRef, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { Alert } from "../../../components/ui/overlays/Alert";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Select } from "../../../components/ui/inputs/Select";
import { Input } from "../../../components/ui/inputs/Input";
import { Button } from "../../../components/ui/primitives/Button";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import { DocumentCard } from "./DocumentCard";
import { DocumentsUploadCard } from "./DocumentsUploadCard";
import { DocumentVersionsPanel } from "./DocumentVersionsPanel";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";
import { documentsApi } from "../api";
import type {
  OperationalSignalsResponse,
  PermanentDocumentResponse,
  UploadDocumentPayload,
} from "../api";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "../../../utils/toast";
import { DOC_TYPE_LABELS } from "../documents.constants";
import type { BusinessResponse } from "@/features/clients";

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEAR_RANGE = 7;
const TAX_YEARS = Array.from(
  { length: TAX_YEAR_RANGE },
  (_, i) => CURRENT_YEAR - i,
);
const UPLOAD_FORM_ID = "documents-upload-form";
const ALL_DOCUMENT_TYPES_OPTION = { value: "", label: "כל הסוגים" };
const ALL_TAX_YEARS_OPTION = { value: "", label: "כל השנים" };
const SEARCH_PLACEHOLDER = "חיפוש לפי שם קובץ או סוג מסמך";
const DOWNLOAD_ERROR_MESSAGE = "שגיאה בהורדת המסמך";
const PREVIEW_ERROR_MESSAGE = "שגיאה בטעינת המסמך";

const DOCUMENT_TYPE_OPTIONS = [
  ALL_DOCUMENT_TYPES_OPTION,
  ...Object.entries(DOC_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

const TAX_YEAR_OPTIONS = [
  ALL_TAX_YEARS_OPTION,
  ...TAX_YEARS.map((year) => ({
    value: String(year),
    label: String(year),
  })),
];

const getDocumentTypeLabel = (
  documentType: PermanentDocumentResponse["document_type"] | string,
) => DOC_TYPE_LABELS[documentType] ?? documentType;

const getMissingDocumentsMessage = (
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

const filterDocuments = (
  documents: PermanentDocumentResponse[],
  searchTerm: string,
  documentType: string,
) =>
  documents.filter((doc) => {
    if (documentType && doc.document_type !== documentType) return false;
    return matchesDocumentSearch(doc, searchTerm);
  });

const getCountLabel = (filteredCount: number, totalCount: number) =>
  filteredCount !== totalCount
    ? `${filteredCount}/${totalCount}`
    : `${totalCount}`;

interface DocumentsDataCardsProps {
  documents: PermanentDocumentResponse[];
  signals: OperationalSignalsResponse;
  taxYear: number | null;
  onTaxYearChange: (year: number | null) => void;
  businesses: BusinessResponse[];
  businessesLoading: boolean;
  submitUpload: (payload: {
    document_type: UploadDocumentPayload["document_type"];
    business_id?: number | null;
    file: File;
    tax_year?: number | null;
  }) => Promise<boolean>;
  uploadError: string | null;
  uploading: boolean;
  onDelete: (id: number) => Promise<void>;
  onReplace: (id: number, file: File) => Promise<void>;
}

export const DocumentsDataCards: React.FC<DocumentsDataCardsProps> = ({
  documents,
  signals,
  taxYear,
  onTaxYearChange,
  businesses,
  businessesLoading,
  submitUpload,
  uploadError,
  uploading,
  onDelete,
  onReplace,
}) => {
  const role = useAuthStore((s) => s.user?.role);
  const isAdvisor = role === "advisor";

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCanSubmit, setUploadCanSubmit] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [replacingId, setReplacingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [expandedVersionsId, setExpandedVersionsId] = useState<number | null>(
    null,
  );
  const [previewDoc, setPreviewDoc] =
    useState<PermanentDocumentResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingReplaceId = useRef<number | null>(null);

  const closeUploadModal = () => {
    setUploadOpen(false);
    setUploadCanSubmit(false);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId === null) return;
    setDeletingId(confirmDeleteId);
    setConfirmDeleteId(null);
    try {
      await onDelete(confirmDeleteId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleReplaceClick = (id: number) => {
    pendingReplaceId.current = id;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = pendingReplaceId.current;
    if (!file || id === null) return;
    e.target.value = "";
    setReplacingId(id);
    try {
      await onReplace(id, file);
    } finally {
      setReplacingId(null);
      pendingReplaceId.current = null;
    }
  };

  const handleDownloadClick = async (id: number) => {
    setDownloadingId(id);
    try {
      const { url } = await documentsApi.getDownloadUrl(id);
      window.open(url, "_blank");
    } catch {
      toast.error(DOWNLOAD_ERROR_MESSAGE);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreviewClick = async (doc: PermanentDocumentResponse) => {
    setPreviewDoc(doc);
    setPreviewUrl(null);
    try {
      const { url } = await documentsApi.getDownloadUrl(doc.id);
      setPreviewUrl(url);
    } catch {
      toast.error(PREVIEW_ERROR_MESSAGE);
      setPreviewDoc(null);
    }
  };

  const handleExpandVersions = (id: number) => {
    setExpandedVersionsId((prev) => (prev === id ? null : id));
  };

  const filteredDocuments = useMemo(
    () => filterDocuments(documents, search, filterType),
    [documents, filterType, search],
  );

  const expandedDoc = useMemo(
    () =>
      expandedVersionsId !== null
        ? documents.find((d) => d.id === expandedVersionsId)
        : null,
    [documents, expandedVersionsId],
  );

  const countLabel = getCountLabel(filteredDocuments.length, documents.length);

  const activeFilterBadges = [
    search
      ? {
          key: "search",
          label: `חיפוש: ${search}`,
          onRemove: () => setSearch(""),
        }
      : null,
    filterType
      ? {
          key: "filterType",
          label: getDocumentTypeLabel(filterType),
          onRemove: () => setFilterType(""),
        }
      : null,
    taxYear
      ? {
          key: "taxYear",
          label: `שנה: ${taxYear}`,
          onRemove: () => onTaxYearChange(null),
        }
      : null,
  ].filter((badge): badge is NonNullable<typeof badge> => badge !== null);

  const resetFilters = () => {
    setSearch("");
    setFilterType("");
    onTaxYearChange(null);
  };

  return (
    <div className="space-y-4">
      {signals.missing_documents.length > 0 && (
        <Alert
          variant="warning"
          message={getMissingDocumentsMessage(signals.missing_documents)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-900">
          מסמכים ({countLabel})
        </h3>
        <Button
          size="sm"
          onClick={() => setUploadOpen(true)}
          className="gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          העלאת מסמך
        </Button>
      </div>

      {/* Toolbar */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder={SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<Search className="h-3.5 w-3.5" />}
            className="h-8 w-56 text-sm"
          />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={DOCUMENT_TYPE_OPTIONS}
          />
          <Select
            value={taxYear ?? ""}
            onChange={(e) =>
              onTaxYearChange(e.target.value ? Number(e.target.value) : null)
            }
            options={TAX_YEAR_OPTIONS}
          />
        </div>
        <ActiveFilterBadges
          badges={activeFilterBadges}
          onReset={resetFilters}
        />
      </div>

      {/* Card grid */}
      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-14 text-center">
          <FileText className="h-9 w-9 text-gray-300" />
          {documents.length === 0 ? (
            <>
              <p className="text-sm font-medium text-gray-500">
                עדיין לא הועלו מסמכים ללקוח זה
              </p>
              <Button
                size="sm"
                onClick={() => setUploadOpen(true)}
                className="gap-1.5 mt-1"
              >
                <Plus className="h-4 w-4" />
                העלאת מסמך ראשון
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-500">
                לא נמצאו מסמכים מתאימים לחיפוש
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              isAdvisor={isAdvisor}
              downloadingId={downloadingId}
              replacingId={replacingId}
              deletingId={deletingId}
              onDownload={handleDownloadClick}
              onPreview={handlePreviewClick}
              onReplace={handleReplaceClick}
              onDelete={(id) => setConfirmDeleteId(id)}
              handleExpandVersions={handleExpandVersions}
            />
          ))}
        </div>
      )}

      {/* Version history panel */}
      {expandedDoc && (
        <DocumentVersionsPanel
          clientId={expandedDoc.client_record_id}
          documentType={expandedDoc.document_type}
          taxYear={expandedDoc.tax_year ?? undefined}
        />
      )}

      {/* Upload modal */}
      <Modal
        open={uploadOpen}
        title="העלאת מסמך חדש"
        onClose={closeUploadModal}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={closeUploadModal}
              disabled={uploading}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              form={UPLOAD_FORM_ID}
              isLoading={uploading}
              loadingLabel="מעלה..."
              disabled={!uploadCanSubmit}
              className="gap-2 shrink-0"
            >
              העלה מסמך
            </Button>
          </div>
        }
      >
        <DocumentsUploadCard
          formId={UPLOAD_FORM_ID}
          businesses={businesses}
          businessesLoading={businessesLoading}
          submitUpload={submitUpload}
          uploadError={uploadError}
          uploading={uploading}
          initialTaxYear={taxYear}
          onCanSubmitChange={setUploadCanSubmit}
          onSuccess={closeUploadModal}
        />
      </Modal>

      {/* Hidden input for replace flow */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <DocumentPreviewModal
        open={previewDoc !== null}
        onClose={() => {
          setPreviewDoc(null);
          setPreviewUrl(null);
        }}
        url={previewUrl}
        filename={previewDoc?.original_filename ?? null}
        mimeType={previewDoc?.mime_type ?? null}
        onDownload={() => previewDoc && handleDownloadClick(previewDoc.id)}
      />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="מחיקת מסמך"
        message="האם למחוק מסמך זה?"
        confirmLabel="מחק"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

DocumentsDataCards.displayName = "DocumentsDataCards";
