import { useState } from "react";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { TableSkeleton } from "../../../components/ui/TableSkeleton";
import { DocumentsDataCards } from "./DocumentsDataCards";
import { useClientDocumentsTab } from "../hooks/useClientDocumentsTab";

const TAX_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

interface ClientDocumentsTabProps {
  clientId: number;
}

export const ClientDocumentsTab: React.FC<ClientDocumentsTabProps> = ({ clientId }) => {
  const [taxYear, setTaxYear] = useState<number | null>(null);

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
  } = useClientDocumentsTab(clientId, taxYear);

  if (loading) return <TableSkeleton rows={4} columns={2} />;
  if (error) return <ErrorCard message={error} />;

  return (
    <DocumentsDataCards
      documents={documents}
      signals={signals}
      taxYear={taxYear}
      onTaxYearChange={setTaxYear}
      taxYears={TAX_YEARS}
      submitUpload={submitUpload}
      uploadError={uploadError}
      uploading={uploading}
      onDelete={handleDelete}
      onReplace={handleReplace}
    />
  );
};

ClientDocumentsTab.displayName = "ClientDocumentsTab";
