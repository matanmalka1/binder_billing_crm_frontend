import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { annualReportsApi } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";
import { SeasonReportsTable } from "./SeasonReportsTable";
import { AnnualReportDetailDrawer } from "./AnnualReportDetailDrawer";
import { PageLoading } from "../../../components/ui/PageLoading";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { getErrorMessage } from "../../../utils/utils";

interface ClientAnnualReportsTabProps {
  clientId: number;
}

export const ClientAnnualReportsTab: React.FC<ClientAnnualReportsTabProps> = ({ clientId }) => {
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const { data, isPending, error } = useQuery({
    queryKey: QK.tax.annualReportsForClient(clientId),
    queryFn: () => annualReportsApi.listClientReports(clientId),
  });

  if (isPending) return <PageLoading message="טוען דוחות שנתיים..." />;
  if (error) return <ErrorCard message={getErrorMessage(error, "שגיאה בטעינת דוחות שנתיים")} />;

  return (
    <>
      <SeasonReportsTable
        reports={data ?? []}
        onSelect={(report) => setSelectedReportId(report.id)}
      />
      <AnnualReportDetailDrawer
        reportId={selectedReportId}
        onClose={() => setSelectedReportId(null)}
      />
    </>
  );
};
