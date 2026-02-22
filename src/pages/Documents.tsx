import { FolderOpen } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { TableSkeleton } from "../components/ui/TableSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorCard } from "../components/ui/ErrorCard";
import { DocumentsClientCard } from "../features/documents/components/DocumentsClientCard";
import { DocumentsDataCards } from "../features/documents/components/DocumentsDataCards";
import { DocumentsUploadCard } from "../features/documents/components/DocumentsUploadCard";
import { useDocumentsPage } from "../features/documents/hooks/useDocumentsPage";

export const Documents: React.FC = () => {
  const {
    clientOptions,
    documents,
    error,
    loading,
    selectedClientId,
    setClient,
    signals,
    submitUpload,
    uploadError,
    uploading,
  } = useDocumentsPage();

  return (
    <div className="space-y-6">
      {/* Standardized Header */}
      <PageHeader
        title="מסמכים קבועים"
        description="העלאה, צפייה ואותות תפעוליים לפי לקוח"
      />

      {/* Standardized Filter Bar for Client Selection */}
      <FilterBar>
        <DocumentsClientCard
          clientOptions={clientOptions}
          selectedClientId={selectedClientId}
          setClient={setClient}
        />
      </FilterBar>

      {/* Upload Card */}
      <DocumentsUploadCard
        submitUpload={submitUpload}
        uploadError={uploadError}
        uploading={uploading}
      />

      {loading && <TableSkeleton rows={5} columns={4} />}
      {!loading && error && <ErrorCard message={error} />}
      {!loading && !error && selectedClientId > 0 && documents.length === 0 && (
        <EmptyState icon={FolderOpen} message="אין מסמכים להצגה" />
      )}
      {!loading && !error && selectedClientId <= 0 && (
        <EmptyState icon={FolderOpen} message="בחר לקוח להצגת מסמכים" />
      )}
      {!loading && !error && selectedClientId > 0 && documents.length > 0 && (
        <DocumentsDataCards documents={documents} signals={signals} />
      )}
    </div>
  );
};
