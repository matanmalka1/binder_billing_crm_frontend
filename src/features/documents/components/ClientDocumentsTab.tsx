import { useState } from "react";
import { Alert } from "../../../components/ui/overlays/Alert";
import { TableSkeleton } from "../../../components/ui/table/TableSkeleton";
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
    businesses,
    businessesLoading,
    submitUpload,
    uploadError,
    uploading,
    handleDelete,
    handleReplace,
  } = useClientDocumentsTab(clientId, taxYear);

  if (loading) return <TableSkeleton rows={4} columns={2} />;
  if (error) return <Alert variant="error" message={error} />;

  return (
    <DocumentsDataCards
      documents={documents}
      signals={signals}
      taxYear={taxYear}
      onTaxYearChange={setTaxYear}
      taxYears={TAX_YEARS}
      businesses={businesses}
      businessesLoading={businessesLoading}
      submitUpload={submitUpload}
      uploadError={uploadError}
      uploading={uploading}
      onDelete={handleDelete}
      onReplace={handleReplace}
    />
  );
};

ClientDocumentsTab.displayName = "ClientDocumentsTab";
