import { cn } from "../../../utils/utils";
import { formatVatAmount, getVatDeductionRateClass, getVatDeductionRateLabel } from "../utils";
import type { VatCategoryTableProps } from "../types";
import { VAT_DEDUCTIBLE_ACCENT } from "../../../utils/chartColors";

export const VatCategoryTable: React.FC<VatCategoryTableProps> = ({
  rows,
  totalExpenseNet,
  totalGrossVat,
  totalInputVat,
}) => {
  if (rows.length === 0) return null;

  return (
    <div dir="rtl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        פירוט לפי קטגוריה
      </p>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2.5 text-right">קטגוריה</th>
              <th className="px-4 py-2.5 text-right">% ניכוי</th>
              <th className="px-4 py-2.5 text-right">הוצאה ברוטו</th>
              <th className="px-4 py-2.5 text-right">מע&quot;מ בחשבוניות</th>
              <th className="px-4 py-2.5 text-right">מע&quot;מ לניכוי</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {rows.map((row) => (
              <tr key={row.categoryKey} className="hover:bg-gray-50/60">
                <td className="px-4 py-2.5 font-medium text-gray-700">{row.label}</td>
                <td className={cn("px-4 py-2.5 font-mono tabular-nums", getVatDeductionRateClass(row.deductionRate))}>
                  {getVatDeductionRateLabel(row.deductionRate)}
                </td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-gray-600">
                  {formatVatAmount(row.netAmount + row.grossVat)}
                </td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-gray-600">
                  {formatVatAmount(row.grossVat)}
                </td>
                <td className={`px-4 py-2.5 font-mono tabular-nums font-semibold ${VAT_DEDUCTIBLE_ACCENT}`}>
                  {formatVatAmount(row.deductibleVat)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-gray-200 bg-gray-50 text-xs font-bold text-gray-700">
            <tr>
              <td className="px-4 py-2.5">סה&quot;כ</td>
              <td />
              <td className="px-4 py-2.5 font-mono tabular-nums">
                {formatVatAmount(totalExpenseNet + totalGrossVat)}
              </td>
              <td className="px-4 py-2.5 font-mono tabular-nums">{formatVatAmount(totalGrossVat)}</td>
              <td className={`px-4 py-2.5 font-mono tabular-nums ${VAT_DEDUCTIBLE_ACCENT}`}>
                {formatVatAmount(totalInputVat)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

VatCategoryTable.displayName = "VatCategoryTable";
