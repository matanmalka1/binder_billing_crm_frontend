import { PageHeader } from "../../../components/layout/PageHeader";
import { PageStateGuard } from "../../../components/ui/layout/PageStateGuard";
import { AdvancePaymentReportTable } from "./AdvancePaymentReportTable";
import { useAdvancePaymentReport } from "../hooks/useAdvancePaymentReport";
import { MONTH_OPTIONS as BASE_MONTH_OPTIONS } from "../../../utils/utils";

const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const MONTH_OPTIONS = [{ value: "", label: "כל החודשים" }, ...BASE_MONTH_OPTIONS];

const selectCls =
  "rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none";

export const AdvancePaymentReportView: React.FC = () => {
  const { year, setYear, month, setMonth, data, isLoading, error } =
    useAdvancePaymentReport();

  const actions = (
    <div className="flex items-center gap-2">
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className={selectCls}
      >
        {YEAR_OPTIONS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <select
        value={month ?? ""}
        onChange={(e) =>
          setMonth(e.target.value ? Number(e.target.value) : undefined)
        }
        className={selectCls}
      >
        {MONTH_OPTIONS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );

  const description = data
    ? `${data.items.length} לקוחות · אחוז גבייה: ${data.collection_rate.toFixed(1)}%`
    : "";

  const header = (
    <PageHeader
      title="דוח גבייה — מקדמות"
      description={description}
      actions={actions}
    />
  );

  return (
    <PageStateGuard isLoading={isLoading} error={error?.message ?? null} header={header} loadingMessage="טוען דוח...">
      {data && <AdvancePaymentReportTable data={data} />}
    </PageStateGuard>
  );
};

AdvancePaymentReportView.displayName = "AdvancePaymentReportView";
