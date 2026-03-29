import { Printer } from "lucide-react";
import { Button } from "../../../../components/ui/primitives/Button";
import { useEscapeToClose } from "../../../../components/ui/overlays/useEscapeToClose";
import { useYearComparison, type YearComparisonData } from "../../hooks/useYearComparison";
import { cn } from "../../../../utils/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  currentTaxYear: number;
}

type RowDef = { label: string; render: (d: YearComparisonData) => string };

// Season-level rows (financial data unavailable without a reportId)
const ROW_DEFS: RowDef[] = [
  { label: "הכנסות ברוטו", render: () => "—" },
  { label: "הוצאות מוכרות", render: () => "—" },
  { label: "רווח נקי", render: () => "—" },
  { label: "חבות מס", render: () => "—" },
  { label: "מקדמות ששולמו", render: () => "—" },
  { label: "יתרה / החזר", render: () => "—" },
  { label: "שיעור מס אפקטיבי", render: () => "—" },
  { label: "שיעור רווח", render: () => "—" },
  // Season-level data available from SeasonSummary
  { label: "סה\"כ דוחות", render: (d) => d.season ? String(d.season.total) : "—" },
  {
    label: "הוגשו",
    render: (d) =>
      d.season ? String(d.season.submitted + d.season.accepted + d.season.closed) : "—",
  },
  {
    label: "אחוז השלמה",
    render: (d) => d.season ? `${d.season.completion_rate.toFixed(1)}%` : "—",
  },
  { label: "בפיגור", render: (d) => d.season ? String(d.season.overdue_count) : "—" },
];

const ComparisonRows: React.FC<{ data: YearComparisonData[]; currentTaxYear: number }> = ({
  data,
  currentTaxYear,
}) => (
  <>
    {ROW_DEFS.map(({ label, render }) => (
      <tr key={label} className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-2 pr-1 font-medium text-gray-700">{label}</td>
        {data.map((d) => (
          <td
            key={d.year}
            className={cn(
              "py-2 text-center",
              d.year === currentTaxYear
                ? "font-semibold text-amber-700 bg-amber-50/40"
                : "text-gray-800",
            )}
          >
            {render(d)}
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const YearComparisonModal: React.FC<Props> = ({ open, onClose, currentTaxYear }) => {
  const years = [currentTaxYear - 2, currentTaxYear - 1, currentTaxYear];
  const { data, isLoading } = useYearComparison(years);

  useEscapeToClose({ open, onClose });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" dir="rtl">
      <div className="w-full max-w-3xl rounded-xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">השוואת שנים</h3>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => window.print()} className="gap-1.5 text-sm">
              <Printer className="h-4 w-4" />
              הדפסה
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              aria-label="סגירה"
            >
              ×
            </button>
          </div>
        </div>

        <div className="overflow-x-auto px-6 py-4">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-gray-500">טוען נתונים...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-right font-medium text-gray-600">שורה</th>
                  {data.map(({ year }) => (
                    <th
                      key={year}
                      className={cn(
                        "py-2 text-center font-semibold",
                        year === currentTaxYear ? "text-amber-600" : "text-gray-700",
                      )}
                    >
                      {year}
                      {year === currentTaxYear && (
                        <span className="mr-1 text-xs text-amber-500">(נוכחי)</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <ComparisonRows data={data} currentTaxYear={currentTaxYear} />
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t border-gray-100 px-6 py-3 text-left">
          <Button variant="secondary" onClick={onClose}>סגירה</Button>
        </div>
      </div>
    </div>
  );
};
