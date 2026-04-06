import type { BracketBreakdownItem } from "../../api";

interface Props {
  brackets: BracketBreakdownItem[];
}

const fmt = (n: string | number) =>
  Number(n).toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

const fmtRate = (rate: string | number) => `${(Number(rate) * 100).toFixed(0)}%`;

const fmtRange = (from: string | number, to: string | number | null) =>
  to === null ? `מעל ${fmt(from)}` : `${fmt(from)} – ${fmt(to)}`;

export const TaxBracketsTable: React.FC<Props> = ({ brackets }) => {
  if (brackets.length === 0) return null;

  const lastIndex = brackets.length - 1;

  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        פירוט מדרגות מס
      </p>
      <div className="overflow-hidden rounded-md border border-gray-200">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1.5 text-right font-medium text-gray-500">מדרגה</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-500">טווח הכנסה</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-500">הכנסה במדרגה</th>
              <th className="px-2 py-1.5 text-right font-medium text-gray-500">מס במדרגה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brackets.map((b, i) => (
              <tr
                key={i}
                className={i === lastIndex ? "bg-warning-50 font-semibold" : "bg-white"}
              >
                <td className="px-2 py-1.5 text-gray-900">{fmtRate(b.rate)}</td>
                <td className="px-2 py-1.5 text-gray-600 tabular-nums" dir="ltr">
                  {fmtRange(b.from_amount, b.to_amount)}
                </td>
                <td className="px-2 py-1.5 text-gray-900 tabular-nums" dir="ltr">
                  {fmt(b.taxable_in_bracket)}
                </td>
                <td className="px-2 py-1.5 text-gray-900 tabular-nums" dir="ltr">
                  {fmt(b.tax_in_bracket)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
