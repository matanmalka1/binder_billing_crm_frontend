import { FolderOpen } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { FilterBar } from "../components/ui/FilterBar";
import { PaginatedTableView } from "../components/ui/PaginatedTableView";
import { ErrorCard } from "../components/ui/ErrorCard";
import { PageLoading } from "../components/ui/PageLoading";
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
      <PageHeader
        title="מסמכים קבועים"
        description="העלאה, צפייה ואותות תפעוליים לפי לקוח"
      />

      <FilterBar>
        <DocumentsClientCard
          clientOptions={clientOptions}
          selectedClientId={selectedClientId}
          setClient={setClient}
        />
      </FilterBar>

      <DocumentsUploadCard
        submitUpload={submitUpload}
        uploadError={uploadError}
        uploading={uploading}
      />

      <PaginatedTableView
        data={selectedClientId > 0 ? documents : []}
        loading={loading}
        error={error}
        pagination={{
          page: 1,
          pageSize: Math.max(documents.length, 1),
          total: documents.length,
          onPageChange: () => {},
        }}
        renderTable={() => (
          <DocumentsDataCards documents={documents} signals={signals} />
        )}
        emptyState={{
          icon: FolderOpen,
          message:
            selectedClientId > 0
              ? "אין מסמכים להצגה"
              : "בחר לקוח להצגת מסמכים",
        }}
      />
    </div>
  );
};
