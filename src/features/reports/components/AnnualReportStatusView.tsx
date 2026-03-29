import { PageHeader } from "../../../components/layout/PageHeader";
import { PageStateGuard } from "../../../components/ui/layout/PageStateGuard";
import { AnnualReportStatusTable } from "./AnnualReportStatusTable";
import { useAnnualReportStatusReport } from "../hooks/useAnnualReportStatusReport";

const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

export const AnnualReportStatusView: React.FC = () => {
  const { taxYear, setTaxYear, data, isLoading, error } =
    useAnnualReportStatusReport();

  const actions = (
    <select
      value={taxYear}
      onChange={(e) => setTaxYear(Number(e.target.value))}
      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
    >
      {YEAR_OPTIONS.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
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
