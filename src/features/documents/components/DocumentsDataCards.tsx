import { useRef, useState } from "react";
import { FileText, RefreshCw, Trash2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { DataTable, type Column } from "../../../components/ui/DataTable";
import { AccessBanner } from "../../../components/ui/AccessBanner";
import { DocumentsUploadCard } from "./DocumentsUploadCard";
import type {
  OperationalSignalsResponse,
  PermanentDocumentResponse,
  UploadDocumentPayload,
} from "../../../api/documents.api";
import { formatDate } from "../../../utils/utils";
import { useAuthStore } from "../../../store/auth.store";

const DOC_TYPE_LABELS: Record<string, string> = {
  id_copy: "צילום תעודה מזהה",
  power_of_attorney: "ייפוי כוח",
  engagement_agreement: "הסכם התקשרות",
};

interface DocumentsDataCardsProps {
  documents: PermanentDocumentResponse[];
  signals: OperationalSignalsResponse;
  submitUpload: (payload: {
    document_type: UploadDocumentPayload["document_type"];
    file: File;
  }) => Promise<boolean>;
  uploadError: string | null;
  uploading: boolean;
  onDelete: (id: number) => Promise<void>;
  onReplace: (id: number, file: File) => Promise<void>;
}

export const DocumentsDataCards: React.FC<DocumentsDataCardsProps> = ({
  documents,
  signals,
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingReplaceId = useRef<number | null>(null);

  const handleDeleteClick = (id: number) => setConfirmDeleteId(id);

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

  const columns: Column<PermanentDocumentResponse>[] = [
    {
      key: "document_type",
      header: "סוג מסמך",
      render: (doc) => (
        <span className="font-medium text-gray-900">
          {DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type}
        </span>
      ),
    },
    {
      key: "uploaded_at",
      header: "תאריך העלאה",
      render: (doc) => (
        <span className="text-gray-500 tabular-nums">{formatDate(doc.uploaded_at)}</span>
      ),
    },
    ...(isAdvisor
      ? [
          {
            key: "actions" as keyof PermanentDocumentResponse,
            header: "",
            render: (doc: PermanentDocumentResponse) => (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleReplaceClick(doc.id)}
                  disabled={replacingId === doc.id}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  title="החלף מסמך"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {replacingId === doc.id ? "מחליף..." : "החלף"}
                </button>
                <button
                  onClick={() => handleDeleteClick(doc.id)}
                  disabled={deletingId === doc.id}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                  title="מחק מסמך"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deletingId === doc.id ? "מוחק..." : "מחק"}
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      {signals.missing_documents.length > 0 && (
        <AccessBanner
          variant="warning"
          message={`מסמכים חסרים: ${signals.missing_documents.map((d) => DOC_TYPE_LABELS[d] ?? d).join(", ")}`}
        />
      )}

      <Card
        title={`מסמכים (${documents.length})`}
        actions={
          <DocumentsUploadCard
            submitUpload={submitUpload}
            uploadError={uploadError}
            uploading={uploading}
          />
        }
      >
        <DataTable
          data={documents}
          columns={columns}
          getRowKey={(doc) => doc.id}
          emptyState={{
            icon: FileText,
            message: "לא נמצאו מסמכים ללקוח זה",
          }}
        />
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm space-y-4">
            <p className="text-sm text-gray-700">האם למחוק מסמך זה?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DocumentsDataCards.displayName = "DocumentsDataCards";
