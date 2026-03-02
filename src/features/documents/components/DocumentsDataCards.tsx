import { FileText } from "lucide-react";
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
    key: "uploaded_at",
    header: "תאריך העלאה",
    render: (doc) => (
      <span className="text-gray-500 tabular-nums">{formatDate(doc.uploaded_at)}</span>
    ),
  },
];

interface DocumentsDataCardsProps {
  documents: PermanentDocumentResponse[];
  signals: OperationalSignalsResponse;
  submitUpload: (payload: {
    document_type: UploadDocumentPayload["document_type"];
    file: File;
  }) => Promise<boolean>;
  uploadError: string | null;
  uploading: boolean;
}

export const DocumentsDataCards: React.FC<DocumentsDataCardsProps> = ({
  documents,
  signals,
  submitUpload,
  uploadError,
  uploading,
}) => (
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
