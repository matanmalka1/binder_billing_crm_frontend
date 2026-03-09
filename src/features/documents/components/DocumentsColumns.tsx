import { Download, RefreshCw, Trash2 } from "lucide-react";
import type { Column } from "../../../components/ui/DataTable";
import type { PermanentDocumentResponse } from "../../../api/documents.api";
import { formatDate } from "../../../utils/utils";

export const DOC_TYPE_LABELS: Record<string, string> = {
  id_copy: "צילום תעודה מזהה",
  power_of_attorney: "ייפוי כוח",
  engagement_agreement: "הסכם התקשרות",
};

interface BuildDocColumnsOptions {
  isAdvisor: boolean;
  downloadingId: number | null;
  replacingId: number | null;
  deletingId: number | null;
  onDownload: (id: number) => void;
  onReplace: (id: number) => void;
  onDelete: (id: number) => void;
}

export const buildDocumentColumns = ({
  isAdvisor,
  downloadingId,
  replacingId,
  deletingId,
  onDownload,
  onReplace,
  onDelete,
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
          {/* Download — available to all roles */}
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

          {/* Replace + Delete — advisor only */}
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