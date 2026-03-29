import { useRef, useState } from "react";
import { FileText } from "lucide-react";
import { Card } from "../../../components/ui/primitives/Card";
import { DataTable } from "../../../components/ui/table/DataTable";
import { Alert } from "../../../components/ui/overlays/Alert";
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
import { useRole } from "../../../hooks/useRole";
import { toast } from "../../../utils/toast";
import { DOC_TYPE_LABELS } from "../documents.constants";

interface DocumentsDataCardsProps {
  documents: PermanentDocumentResponse[];
  signals: OperationalSignalsResponse;
  taxYear: number | null;
  onTaxYearChange: (year: number | null) => void;
  taxYears: number[];
  submitUpload: (payload: {
    document_type: UploadDocumentPayload["document_type"];
    file: File;
    tax_year?: number | null;
  }) => Promise<boolean>;
  uploadError: string | null;
  uploading: boolean;
  onDelete: (id: number) => Promise<void>;
  onReplace: (id: number, file: File) => Promise<void>;
  handleApprove: (id: number) => void;
  handleReject: (id: number, notes: string) => void;
}

export const DocumentsDataCards: React.FC<DocumentsDataCardsProps> = ({
  documents, signals, taxYear, onTaxYearChange, taxYears,
  submitUpload, uploadError, uploading, onDelete, onReplace,
  handleApprove, handleReject,
}) => {
  const role = useAuthStore((s) => s.user?.role);
  const isAdvisor = role === "advisor";
  const { can } = useRole();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [replacingId, setReplacingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [expandedVersionsId, setExpandedVersionsId] = useState<number | null>(null);

  const [previewDoc, setPreviewDoc] = useState<PermanentDocumentResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingReplaceId = useRef<number | null>(null);

  const handleConfirmDelete = async () => {
    if (confirmDeleteId === null) return;
    setDeletingId(confirmDeleteId);
    setConfirmDeleteId(null);
    try { await onDelete(confirmDeleteId); } finally { setDeletingId(null); }
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
    try { await onReplace(id, file); } finally { setReplacingId(null); pendingReplaceId.current = null; }
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

  const handleRejectClick = (id: number) => {
    setRejectingId(id);
  };

  const handleConfirmReject = () => {
    if (rejectingId === null) return;
    handleReject(rejectingId, rejectNote);
    setRejectingId(null);
    setRejectNote("");
  };

  const columns = buildDocumentColumns({
    isAdvisor,
    canPerformActions: can.performBinderActions,
    downloadingId,
    replacingId,
    deletingId,
    rejectingId,
    onDownload: handleDownloadClick,
    onPreview: handlePreviewClick,
    onReplace: handleReplaceClick,
    onDelete: (id) => setConfirmDeleteId(id),
    handleApprove,
    handleReject: handleRejectClick,
    handleExpandVersions,
  });

  const expandedDoc = expandedVersionsId !== null
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

      <Card title="העלאת מסמך">
        <DocumentsUploadCard
          submitUpload={submitUpload}
          uploadError={uploadError}
          uploading={uploading}
          selectedTaxYear={taxYear}
        />
      </Card>

      <Card
        title={`מסמכים (${documents.length})`}
        actions={
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">שנת מס:</label>
            <select
              value={taxYear ?? ""}
              onChange={(e) => onTaxYearChange(e.target.value ? Number(e.target.value) : null)}
              className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">הכל</option>
              {taxYears.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        }
      >
        <DataTable
          data={documents}
          columns={columns}
          getRowKey={(doc) => doc.id}
          emptyState={{ icon: FileText, message: "לא נמצאו מסמכים ללקוח זה" }}
        />
        {expandedDoc && (
          <DocumentVersionsPanel
            clientId={expandedDoc.client_id}
            documentType={expandedDoc.document_type}
            taxYear={expandedDoc.tax_year ?? undefined}
          />
        )}
      </Card>

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

      <DocumentPreviewModal
        open={previewDoc !== null}
        onClose={() => { setPreviewDoc(null); setPreviewUrl(null); }}
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

      <ConfirmDialog
        open={rejectingId !== null}
        title="דחיית מסמך"
        message="הזן סיבת דחייה:"
        confirmLabel="דחה"
        cancelLabel="ביטול"
        onConfirm={handleConfirmReject}
        onCancel={() => { setRejectingId(null); setRejectNote(""); }}
      >
        <textarea
          value={rejectNote}
          onChange={(e) => setRejectNote(e.target.value)}
          placeholder="הערות"
          className="mt-2 w-full rounded border border-gray-200 px-2 py-1 text-sm"
          rows={3}
        />
      </ConfirmDialog>
    </div>
  );
};

DocumentsDataCards.displayName = "DocumentsDataCards";
