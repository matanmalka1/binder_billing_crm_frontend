import { useRef, useState } from "react";
import { FileText } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { DataTable } from "../../../components/ui/DataTable";
import { AccessBanner } from "../../../components/ui/AccessBanner";
import { DocumentsUploadCard } from "./DocumentsUploadCard";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { buildDocumentColumns, DOC_TYPE_LABELS } from "./DocumentsColumns";
import type {
  OperationalSignalsResponse,
  PermanentDocumentResponse,
  UploadDocumentPayload,
} from "../../../api/documents.api";
import { useAuthStore } from "../../../store/auth.store";

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
}

export const DocumentsDataCards: React.FC<DocumentsDataCardsProps> = ({
  documents, signals, taxYear, onTaxYearChange, taxYears,
  submitUpload, uploadError, uploading, onDelete, onReplace,
}) => {
  const role = useAuthStore((s) => s.user?.role);
  const isAdvisor = role === "advisor";
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [replacingId, setReplacingId] = useState<number | null>(null);
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

  const columns = buildDocumentColumns({
    isAdvisor, replacingId, deletingId,
    onReplace: handleReplaceClick, onDelete: (id) => setConfirmDeleteId(id),
  });

  return (
    <div className="space-y-4">
      {signals.missing_documents.length > 0 && (
        <AccessBanner variant="warning"
          message={`מסמכים חסרים: ${signals.missing_documents.map((d) => DOC_TYPE_LABELS[d] ?? d).join(", ")}`} />
      )}

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">שנת מס:</label>
        <select value={taxYear ?? ""} onChange={(e) => onTaxYearChange(e.target.value ? Number(e.target.value) : null)}
          className="rounded border border-gray-200 px-2 py-1 text-sm bg-white">
          <option value="">הכל</option>
          {taxYears.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <Card title={`מסמכים (${documents.length})`}
        actions={<DocumentsUploadCard submitUpload={submitUpload} uploadError={uploadError} uploading={uploading} taxYears={taxYears} />}>
        <DataTable data={documents} columns={columns} getRowKey={(doc) => doc.id}
          emptyState={{ icon: FileText, message: "לא נמצאו מסמכים ללקוח זה" }} />
      </Card>

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

      {confirmDeleteId !== null && (
        <ConfirmDeleteDialog onConfirm={handleConfirmDelete} onCancel={() => setConfirmDeleteId(null)} />
      )}
    </div>
  );
};

DocumentsDataCards.displayName = "DocumentsDataCards";
