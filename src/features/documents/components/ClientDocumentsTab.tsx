import { FolderOpen } from "lucide-react";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { TableSkeleton } from "../../../components/ui/TableSkeleton";
import { DocumentsDataCards } from "./DocumentsDataCards";
import { useClientDocumentsTab } from "../hooks/useClientDocumentsTab";

interface ClientDocumentsTabProps {
  clientId: number;
}

export const ClientDocumentsTab: React.FC<ClientDocumentsTabProps> = ({ clientId }) => {
  const {
    documents,
    signals,
    loading,
    error,
    submitUpload,
    uploadError,
    uploading,
    handleDelete,
    handleReplace,
  } = useClientDocumentsTab(clientId);

  if (loading) return <TableSkeleton rows={4} columns={2} />;
  if (error) return <ErrorCard message={error} />;

  if (documents.length === 0) return <EmptyState icon={FolderOpen} message="אין מסמכים להצגה ללקוח זה" />;

  return (
    <DocumentsDataCards
      documents={documents}
      signals={signals}
      submitUpload={submitUpload}
      uploadError={uploadError}
      uploading={uploading}
      onDelete={handleDelete}
      onReplace={handleReplace}
    />
  );
};

ClientDocumentsTab.displayName = "ClientDocumentsTab";
