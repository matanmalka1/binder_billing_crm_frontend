import { cn } from "../../../utils/utils";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { useVatWorkItemDetail, type VatCategorySummaryRow } from "../hooks/useVatWorkItemDetail";
import { PageLoading } from "../../../components/ui/PageLoading";

interface VatWorkItemDrawerProps {
  item: VatWorkItemResponse | null;
  onClose: () => void;
}

const formatAmount = (n: number): string => `₪${n.toFixed(2)}`;

interface SectionTableProps {
  title: string;
  rows: VatCategorySummaryRow[];
  totalNet: number;
  totalVat: number;
  netLabel: string;
}

const SectionTable: React.FC<SectionTableProps> = ({
  title,
  rows,
  totalNet,
  totalVat,
  netLabel,
}) => (
  <div>
    <h4 className="mb-2 text-sm font-semibold text-gray-700">{title}</h4>
    {rows.length === 0 ? (
      <p className="text-sm text-gray-400">אין נתונים</p>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-right text-xs text-gray-500">
            <th className="py-1.5 font-medium">קטגוריה</th>
            <th className="py-1.5 font-medium">{netLabel}</th>
            <th className="py-1.5 font-medium">מע"מ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-gray-50">
              <td className="py-1.5 text-gray-800">{row.label}</td>
              <td className="py-1.5 font-mono tabular-nums text-gray-800">
                {formatAmount(row.netAmount)}
              </td>
              <td className="py-1.5 font-mono tabular-nums text-gray-800">
                {formatAmount(row.vatAmount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-gray-900 font-semibold">
            <td className="pt-2">סה"כ</td>
            <td className="pt-2 font-mono tabular-nums">{formatAmount(totalNet)}</td>
            <td className="pt-2 font-mono tabular-nums">{formatAmount(totalVat)}</td>
          </tr>
        </tfoot>
      </table>
    )}
  </div>
);
SectionTable.displayName = "SectionTable";

export const VatWorkItemDrawer: React.FC<VatWorkItemDrawerProps> = ({ item, onClose }) => {
  const { summary, loading, error } = useVatWorkItemDetail(item?.id ?? null);

  const isOpen = item !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <p className="text-xs text-gray-500">תיק מע"מ #{item?.id}</p>
            <h3 className="mt-0.5 text-base font-semibold text-gray-900">
              {item?.client_name ?? `לקוח #${item?.client_id}`}
            </h3>
            <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
              <span>תקופה: {item?.period}</span>
              <span>סטטוס: {item ? getVatWorkItemStatusLabel(item.status) : ""}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="סגירה"
          >
            ✕
          </button>
        </div>

        {/* Summary totals bar */}
        {item && (
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 border-b border-gray-100 bg-gray-50 px-6 py-3 text-center">
            <div>
              <p className="text-xs text-gray-500">מע"מ עסקאות</p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-gray-900">
                {formatAmount(Number(item.total_output_vat))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">מע"מ תשומות</p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-gray-900">
                {formatAmount(Number(item.total_input_vat))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">מע"מ לתשלום</p>
              <p
                className={cn(
                  "mt-0.5 font-mono text-sm font-semibold tabular-nums",
                  Number(item.net_vat) >= 0 ? "text-red-600" : "text-green-600",
                )}
              >
                {formatAmount(Number(item.net_vat))}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {loading && <PageLoading />}

          {!loading && error && (
            <p className="text-sm text-red-500">שגיאה בטעינת הנתונים</p>
          )}

          {!loading && !error && (
            <>
              <SectionTable
                title='עסקאות (מע"מ עסקאות)'
                rows={summary.outputRows}
                totalNet={summary.totalOutputNet}
                totalVat={summary.totalOutputVat}
                netLabel="מחזור"
              />
              <div className="border-t border-gray-100" />
              <SectionTable
                title='תשומות (מע"מ תשומות)'
                rows={summary.inputRows}
                totalNet={summary.totalInputNet}
                totalVat={summary.totalInputVat}
                netLabel="עלות נטו"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
VatWorkItemDrawer.displayName = "VatWorkItemDrawer";
