import {
  actionsColumn,
  dateColumn,
  textColumn,
  type Column,
} from "../../../components/ui/table";
import type { PermanentDocumentResponse } from "../api";
import { DOC_TYPE_LABELS } from "../documents.constants";
import { DocumentRowActions, type DocumentRowActionsProps } from "./DocumentRowActions";

type BuildDocColumnsOptions = Omit<DocumentRowActionsProps, "doc">;

export const buildDocumentColumns = ({
  isAdvisor,
  downloadingId,
  replacingId,
  deletingId,
  onDownload,
  onPreview,
  onReplace,
  onDelete,
  handleExpandVersions,
}: BuildDocColumnsOptions): Column<PermanentDocumentResponse>[] => [
  textColumn({
    key: "document_type",
    header: "סוג מסמך",
    valueClassName: "font-medium text-gray-900",
    getValue: (doc) => DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type,
  }),
  {
    key: "original_filename" as keyof PermanentDocumentResponse,
    header: "שם קובץ",
    render: (doc) => (
      <button
        type="button"
        onClick={() => onPreview(doc)}
        className="block max-w-48 truncate text-right font-mono text-xs text-primary-700 hover:underline"
      >
        {doc.original_filename ?? "—"}
      </button>
    ),
  },
  {
    key: "tax_year" as keyof PermanentDocumentResponse,
    header: "שנת מס",
    render: (doc) => (
      <span className="text-sm text-gray-600">{doc.tax_year ?? "—"}</span>
    ),
  },
  dateColumn({
    key: "uploaded_at",
    header: "תאריך העלאה",
    getValue: (doc) => doc.uploaded_at,
  }),
  actionsColumn({
    key: "actions" as keyof PermanentDocumentResponse,
    header: "",
    render: (doc) => (
      <DocumentRowActions
        doc={doc}
        isAdvisor={isAdvisor}
        downloadingId={downloadingId}
        replacingId={replacingId}
        deletingId={deletingId}
        onDownload={onDownload}
        onPreview={onPreview}
        onReplace={onReplace}
        onDelete={onDelete}
        handleExpandVersions={handleExpandVersions}
      />
    ),
  }),
];
