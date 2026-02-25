import { FolderOpen } from "lucide-react";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { TableSkeleton } from "../../../components/ui/TableSkeleton";
import { DocumentsDataCards } from "./DocumentsDataCards";
import { DocumentsUploadCard } from "./DocumentsUploadCard";
import { useClientDocumentsTab } from "../hooks/useClientDocumentsTab";

interface ClientDocumentsTabProps {
  clientId: number;
}

export const ClientDocumentsTab: React.FC<ClientDocumentsTabProps> = ({ clientId }) => {
  const { documents, signals, loading, error, submitUpload, uploadError, uploading } =
    useClientDocumentsTab(clientId);

  return (
    <div className="space-y-6">
      <DocumentsUploadCard
        submitUpload={submitUpload}
        uploadError={uploadError}
        uploading={uploading}
      />

      {loading && <TableSkeleton rows={4} columns={3} />}
      {!loading && error && <ErrorCard message={error} />}
      {!loading && !error && documents.length === 0 && (
        <EmptyState icon={FolderOpen} message="אין מסמכים להצגה ללקוח זה" />
      )}
      {!loading && !error && documents.length > 0 && (
        <DocumentsDataCards documents={documents} signals={signals} />
      )}
    </div>
  );
};

ClientDocumentsTab.displayName = "ClientDocumentsTab";