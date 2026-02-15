import React from "react";
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
      <header>
        <h2 className="text-2xl font-bold text-gray-900">מסמכים קבועים</h2>
        <p className="text-gray-600">העלאה, צפייה ואותות תפעוליים לפי לקוח</p>
      </header>

      <DocumentsClientCard
        clientOptions={clientOptions}
        selectedClientId={selectedClientId}
        setClient={setClient}
      />
      <DocumentsUploadCard
        submitUpload={submitUpload}
        uploadError={uploadError}
        uploading={uploading}
      />

      {loading && <PageLoading />}

      {error && <ErrorCard message={error} />}

      {!loading && !error && selectedClientId > 0 && (
        <DocumentsDataCards documents={documents} signals={signals} />
      )}
    </div>
  );
};
