import { CheckCircle2, XCircle, FileText } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { DataTable, type Column } from "../../../components/ui/DataTable";
import { AccessBanner } from "../../../components/ui/AccessBanner";
import type { OperationalSignalsResponse, PermanentDocumentResponse } from "../../../api/documents.api";
import { formatDateTime } from "../../../utils/utils";

const DOC_TYPE_LABELS: Record<string, string> = {
  id_copy: "צילום תעודה מזהה",
  power_of_attorney: "ייפוי כוח",
  engagement_agreement: "הסכם התקשרות",
};

const COLUMNS: Column<PermanentDocumentResponse>[] = [
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
    key: "is_present",
    header: "קיים",
    render: (doc) =>
      doc.is_present ? (
        <span className="inline-flex items-center gap-1.5 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-xs font-medium">קיים</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-red-500">
          <XCircle className="h-4 w-4" />
          <span className="text-xs font-medium">חסר</span>
        </span>
      ),
  },
  {
    key: "uploaded_at",
    header: "הועלה בתאריך",
    render: (doc) => (
      <span className="text-gray-500 tabular-nums">{formatDateTime(doc.uploaded_at)}</span>
    ),
  },
];

interface DocumentsDataCardsProps {
  documents: PermanentDocumentResponse[];
  signals: OperationalSignalsResponse;
}

export const DocumentsDataCards: React.FC<DocumentsDataCardsProps> = ({ documents, signals }) => (
  <div className="space-y-4">
    {signals.missing_documents.length > 0 && (
      <AccessBanner
        variant="warning"
        message={`מסמכים חסרים: ${signals.missing_documents.map((d) => DOC_TYPE_LABELS[d] ?? d).join(", ")}`}
      />
    )}

    <Card title="מסמכים שהועלו">
      <DataTable
        data={documents}
        columns={COLUMNS}
        getRowKey={(doc) => doc.id}
        emptyState={{
          icon: FileText,
          message: "לא נמצאו מסמכים ללקוח זה",
        }}
      />
    </Card>
  </div>
);

DocumentsDataCards.displayName = "DocumentsDataCards";