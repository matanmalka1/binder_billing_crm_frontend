import type { Column } from "../../../components/ui/table/DataTable";
import type { PermanentDocumentResponse } from "../api";
import { Badge } from "../../../components/ui/primitives/Badge";
import { formatDate } from "../../../utils/utils";
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
    key: "notes",
    header: "הערות",
    render: (doc) => (
      <span className="text-gray-500 text-sm">{doc.notes ?? "—"}</span>
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
    headerClassName: "w-10",
    className: "w-10",
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
  },
];
