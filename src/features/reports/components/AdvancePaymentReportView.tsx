import { PageHeader } from "../../../components/layout/PageHeader";
import { PageStateGuard } from "../../../components/ui/PageStateGuard";
import { AdvancePaymentReportTable } from "./AdvancePaymentReportTable";
import { useAdvancePaymentReport } from "../hooks/useAdvancePaymentReport";

const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const MONTH_OPTIONS = [
  { value: "", label: "כל החודשים" },
  { value: "1", label: "ינואר" },
  { value: "2", label: "פברואר" },
  { value: "3", label: "מרץ" },
  { value: "4", label: "אפריל" },
  { value: "5", label: "מאי" },
  { value: "6", label: "יוני" },
  { value: "7", label: "יולי" },
  { value: "8", label: "אוגוסט" },
  { value: "9", label: "ספטמבר" },
  { value: "10", label: "אוקטובר" },
  { value: "11", label: "נובמבר" },
  { value: "12", label: "דצמבר" },
];

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
    <PageStateGuard isLoading={isLoading} error={error} header={header} loadingMessage="טוען דוח...">
      {data && <AdvancePaymentReportTable data={data} />}
    </PageStateGuard>
  );
};

AdvancePaymentReportView.displayName = "AdvancePaymentReportView";
