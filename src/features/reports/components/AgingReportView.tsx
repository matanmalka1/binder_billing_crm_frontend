import { FileDown, FileSpreadsheet } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { PageStateGuard } from "../../../components/ui/PageStateGuard";
import { PageHeader } from "../../../components/layout/PageHeader";
import { AgingReportFilters } from "./AgingReportFilters";
import { AgingReportHeader } from "./AgingReportHeader";
import { AgingReportTable } from "./Agingreporttable";
import { useAgingReport } from "../hooks/useAgingReport";

export const AgingReportView: React.FC = () => {
  const { asOfDate, setAsOfDate, exporting, handleExport, data, isLoading, error } =
    useAgingReport();

  const actions = (
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
  );

  const header = (
    <PageHeader
      title="דוח חובות לקוחות"
      description="ניתוח חובות לפי גיל החוב"
      variant="gradient"
      actions={actions}
    />
  );

  return (
    <PageStateGuard isLoading={isLoading} error={error} header={header} loadingMessage="טוען דוח...">
      {data && (
        <>
          <AgingReportFilters asOfDate={asOfDate} onDateChange={setAsOfDate} />
          <AgingReportHeader data={data} />
          <AgingReportTable items={data.items} />
        </>
      )}
    </PageStateGuard>
  );
};

AgingReportView.displayName = "AgingReportView";