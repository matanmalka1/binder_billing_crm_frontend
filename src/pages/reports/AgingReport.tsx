import { FileDown, FileSpreadsheet } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { PageLoading } from "../../components/ui/PageLoading";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { AgingReportFilters } from "../../features/reports/components/AgingReportFilters";
import { AgingReportSummary } from "../../features/reports/components/Agingreportsummary";
import { AgingReportTable } from "../../features/reports/components/Agingreporttable";
import { AgingReportMetadata } from "../../features/reports/components/Agingreportmetadata";
import { useAgingReport } from "../../features/reports/hooks/useAgingReport";

export const AgingReportPage: React.FC = () => {
  const {
    asOfDate,
    setAsOfDate,
    exporting,
    handleExport,
    data,
    isLoading,
    error,
  } = useAgingReport();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="דוח חובות לקוחות" />
        <PageLoading message="טוען דוח..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="דוח חובות לקוחות" />
        <ErrorCard message={error} />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="דוח חובות לקוחות (Aging Report)"
        description="ניתוח חובות לפי גיל החוב"
        variant="gradient"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("excel")}
              isLoading={exporting === "excel"}
              disabled={exporting !== null}
              className="gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              isLoading={exporting === "pdf"}
              disabled={exporting !== null}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
          </div>
        }
      />

      <AgingReportFilters asOfDate={asOfDate} onDateChange={setAsOfDate} />

      <AgingReportSummary data={data} />

      <AgingReportTable items={data.items} />

      <AgingReportMetadata data={data} />
    </div>
  );
};
