import { Download, RefreshCw, Trash2, CheckCircle, XCircle, History } from "lucide-react";
import type { Column } from "../../../components/ui/DataTable";
import type { PermanentDocumentResponse } from "../../../api/documents.api";
import { Badge } from "../../../components/ui/Badge";
import { formatDate } from "../../../utils/utils";
import { DOC_TYPE_LABELS, STATUS_LABELS, STATUS_BADGE_VARIANT } from "../documents.constants";

interface BuildDocColumnsOptions {
  isAdvisor: boolean;
  canPerformActions: boolean;
  downloadingId: number | null;
  replacingId: number | null;
  deletingId: number | null;
  rejectingId: number | null;
  onDownload: (id: number) => void;
  onReplace: (id: number) => void;
  onDelete: (id: number) => void;
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
  handleExpandVersions: (id: number) => void;
}

export const buildDocumentColumns = ({
  isAdvisor,
  canPerformActions,
  downloadingId,
  replacingId,
  deletingId,
  rejectingId,
  onDownload,
  onReplace,
  onDelete,
  handleApprove,
  handleReject,
  handleExpandVersions,
}: BuildDocColumnsOptions): Column<PermanentDocumentResponse>[] => {
  const base: Column<PermanentDocumentResponse>[] = [
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
      key: "version" as keyof PermanentDocumentResponse,
      header: "גרסה",
      render: (doc) => (
        <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          v{doc.version}
        </span>
      ),
    },
    {
      key: "status" as keyof PermanentDocumentResponse,
      header: "סטטוס",
      render: (doc) => (
        <Badge variant={STATUS_BADGE_VARIANT[doc.status] ?? "neutral"}>
          {STATUS_LABELS[doc.status] ?? doc.status}
        </Badge>
      ),
    },
    {
      key: "uploaded_at",
      header: "תאריך העלאה",
      render: (doc) => (
        <span className="text-gray-500 tabular-nums">{formatDate(doc.uploaded_at)}</span>
      ),
    },
    {
      key: "actions" as keyof PermanentDocumentResponse,
      header: "",
      render: (doc) => (
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => onDownload(doc.id)}
            disabled={downloadingId === doc.id}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
            title="הורד מסמך"
          >
            <Download className="h-3.5 w-3.5" />
            {downloadingId === doc.id ? "מוריד..." : "הורד"}
          </button>

          <button
            type="button"
            onClick={() => handleExpandVersions(doc.id)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
            title="היסטוריית גרסאות"
          >
            <History className="h-3.5 w-3.5" />
          </button>

          {canPerformActions && (
            <>
              <button
                type="button"
                onClick={() => handleApprove(doc.id)}
                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800"
                title="אשר מסמך"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                אשר
              </button>
              <button
                type="button"
                onClick={() => handleReject(doc.id)}
                disabled={rejectingId === doc.id}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                title="דחה מסמך"
              >
                <XCircle className="h-3.5 w-3.5" />
                דחה
              </button>
            </>
          )}

          {isAdvisor && (
            <>
              <button
                type="button"
                onClick={() => onReplace(doc.id)}
                disabled={replacingId === doc.id}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                title="החלף מסמך"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {replacingId === doc.id ? "מחליף..." : "החלף"}
              </button>
              <button
                type="button"
                onClick={() => onDelete(doc.id)}
                disabled={deletingId === doc.id}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                title="מחק מסמך"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deletingId === doc.id ? "מוחק..." : "מחק"}
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return base;
};
