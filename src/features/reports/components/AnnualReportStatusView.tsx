import { PageHeader } from "../../../components/layout/PageHeader";
import { PageStateGuard } from "../../../components/ui/layout/PageStateGuard";
import { AnnualReportStatusTable } from "./AnnualReportStatusTable";
import { useAnnualReportStatusReport } from "../hooks/useAnnualReportStatusReport";
import { SelectDropdown } from "../../../components/ui/inputs/SelectDropdown";
import { YEAR_OPTIONS } from "../../../utils/utils";

export const AnnualReportStatusView: React.FC = () => {
  const { taxYear, setTaxYear, data, isLoading, error } =
    useAnnualReportStatusReport();

  const actions = (
    <SelectDropdown
      value={String(taxYear)}
      onChange={(e) => setTaxYear(Number(e.target.value))}
      options={YEAR_OPTIONS}
      className="w-28"
    />
  );

  const header = (
    <PageHeader
      title="סטטוס דוחות שנתיים"
      description={data ? `סה"כ ${data.total} דוחות לשנת ${taxYear}` : ""}
      actions={actions}
    />
  );

  return (
    <PageStateGuard isLoading={isLoading} error={error} header={header} loadingMessage="טוען דוח...">
      {data && <AnnualReportStatusTable statuses={data.statuses} />}
    </PageStateGuard>
  );
};

AnnualReportStatusView.displayName = "AnnualReportStatusView";
