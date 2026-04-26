import {
  actionsColumn,
  dateColumn,
  monoColumn,
  textColumn,
  type Column,
} from "../../../components/ui/table";
import type { PermanentDocumentResponse } from "../api";
import { Badge } from "../../../components/ui/primitives/Badge";
import { DOC_TYPE_LABELS, STATUS_LABELS, STATUS_BADGE_VARIANT } from "../documents.constants";
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
  monoColumn({
    key: "original_filename",
    header: "שם קובץ",
    valueClassName: "block max-w-48 truncate text-xs",
    getValue: (doc) => doc.original_filename,
  }),
  textColumn({
    key: "client_name",
    header: "לקוח משויך",
    valueClassName: "font-medium text-gray-700",
    getValue: (doc) => doc.client_name ?? `לקוח #${doc.client_record_id}`,
  }),
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
  textColumn({
    key: "notes",
    header: "הערות",
    getValue: (doc) => doc.notes,
  }),
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
