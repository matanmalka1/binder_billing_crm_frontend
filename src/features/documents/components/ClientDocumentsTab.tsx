import { useState } from "react";
import { Alert } from "../../../components/ui/overlays/Alert";
import { TableSkeleton } from "../../../components/ui/table/TableSkeleton";
import { DocumentsDataCards } from "./DocumentsDataCards";
import { useClientDocumentsTab } from "../hooks/useClientDocumentsTab";

const TAX_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

interface ClientDocumentsTabProps {
  businessId: number;
}

export const ClientDocumentsTab: React.FC<ClientDocumentsTabProps> = ({ businessId }) => {
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
    handleApprove,
    handleReject,
  } = useClientDocumentsTab(businessId, taxYear);

  if (loading) return <TableSkeleton rows={4} columns={2} />;
  if (error) return <Alert variant="error" message={error} />;

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
      handleApprove={handleApprove}
      handleReject={handleReject}
    />
  );
};

ClientDocumentsTab.displayName = "ClientDocumentsTab";
