import { useRef, useState } from "react";
import { FileText, Search } from "lucide-react";
import { Card } from "../../../components/ui/primitives/Card";
import { DataTable } from "../../../components/ui/table/DataTable";
import { Alert } from "../../../components/ui/overlays/Alert";
import { Select } from "../../../components/ui/inputs/Select";
import { Input } from "../../../components/ui/inputs/Input";
import { DocumentsUploadCard } from "./DocumentsUploadCard";
import { DocumentVersionsPanel } from "./DocumentVersionsPanel";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";
import { buildDocumentColumns } from "./DocumentsColumns";
import { documentsApi } from "../api";
import type {
  OperationalSignalsResponse,
  PermanentDocumentResponse,
  UploadDocumentPayload,
} from "../api";
import { useAuthStore } from "../../../store/auth.store";
import { toast } from "../../../utils/toast";
import { DOC_TYPE_LABELS } from "../documents.constants";
import type { BusinessResponse } from "@/features/clients/api";

const TAX_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

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
    notes?: string | null;
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

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [replacingId, setReplacingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [expandedVersionsId, setExpandedVersionsId] = useState<number | null>(null);

  const [previewDoc, setPreviewDoc] = useState<PermanentDocumentResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingReplaceId = useRef<number | null>(null);

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
      toast.error("שגיאה בהורדת המסמך");
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
      toast.error("שגיאה בטעינת המסמך");
      setPreviewDoc(null);
    }
  };

  const handleExpandVersions = (id: number) => {
    setExpandedVersionsId((prev) => (prev === id ? null : id));
  };

  const columns = buildDocumentColumns({
    isAdvisor,
    downloadingId,
    replacingId,
    deletingId,
    onDownload: handleDownloadClick,
    onPreview: handlePreviewClick,
    onReplace: handleReplaceClick,
    onDelete: (id) => setConfirmDeleteId(id),
    handleExpandVersions,
  });

  const filteredDocuments = documents.filter((doc) => {
    if (filterType && doc.document_type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(doc.original_filename ?? "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const expandedDoc =
    expandedVersionsId !== null
      ? documents.find((d) => d.id === expandedVersionsId)
      : null;

  return (
    <div className="space-y-4">
      {signals.missing_documents.length > 0 && (
        <Alert
          variant="warning"
          message={`מסמכים חסרים: ${signals.missing_documents.map((d) => DOC_TYPE_LABELS[d] ?? d).join(", ")}`}
        />
      )}

      <Card
        title={`מסמכים (${filteredDocuments.length}${filteredDocuments.length !== documents.length ? `/${documents.length}` : ""})`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="חיפוש לפי שם קובץ"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={<Search className="h-3.5 w-3.5" />}
              className="h-8 w-44 text-sm"
            />
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: "", label: "כל הסוגים" },
                ...Object.entries(DOC_TYPE_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
            />
            <Select
              value={taxYear ?? ""}
              onChange={(e) =>
                onTaxYearChange(e.target.value ? Number(e.target.value) : null)
              }
              options={[
                { value: "", label: "כל השנים" },
                ...TAX_YEARS.map((y) => ({
                  value: String(y),
                  label: String(y),
                })),
              ]}
            />
          </div>
        }
      >
        <DataTable
          data={filteredDocuments}
          columns={columns}
          getRowKey={(doc) => doc.id}
          emptyState={{ icon: FileText, message: "לא נמצאו מסמכים ללקוח זה" }}
        />
        {expandedDoc && (
          <DocumentVersionsPanel
            clientId={expandedDoc.client_record_id}
            documentType={expandedDoc.document_type}
            taxYear={expandedDoc.tax_year ?? undefined}
          />
        )}
      </Card>

      <Card title="העלאת מסמך">
        <DocumentsUploadCard
          businesses={businesses}
          businessesLoading={businessesLoading}
          submitUpload={submitUpload}
          uploadError={uploadError}
          uploading={uploading}
          initialTaxYear={taxYear}
        />
      </Card>

      {/* Hidden file input exclusively for the replace flow */}
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
