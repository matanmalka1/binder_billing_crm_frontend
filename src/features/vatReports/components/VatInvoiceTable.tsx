import { useState } from "react";
import { Trash2, Receipt } from "lucide-react";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { formatVatAmount } from "../utils";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "../constants";
import { useDeleteInvoice } from "../hooks/useVatInvoiceMutations";
import type { VatInvoiceResponse } from "../../../api/vatReports.api";
import { formatDateTime } from "../../../utils/utils";

interface VatInvoiceTableProps {
  invoices: VatInvoiceResponse[];
  canEdit: boolean;
  workItemId: number;
  sectionType: "income" | "expense";
}

export const VatInvoiceTable: React.FC<VatInvoiceTableProps> = ({
  invoices,
  canEdit,
  workItemId,
  sectionType,
}) => {
  const { deleteInvoice, isDeleting } = useDeleteInvoice(workItemId);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const totalNet = invoices.reduce((s, i) => s + Number(i.net_amount ?? 0), 0);
  const totalVat = invoices.reduce((s, i) => s + Number(i.vat_amount ?? 0), 0);
  const accentBorder = sectionType === "income" ? "border-emerald-300" : "border-orange-300";

  // extra cols: category(expense), created_by, created_at, delete(canEdit)
  const extraCols = (sectionType === "expense" ? 1 : 0) + 2 + (canEdit ? 1 : 0);
  const baseDataCols = 3; // number, date, counterparty
  const totalCols = baseDataCols + extraCols;

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-10 text-center">
        <Receipt className="h-8 w-8 text-gray-300" />
        <p className="text-sm font-medium text-gray-400">אין חשבוניות עדיין</p>
        <p className="text-xs text-gray-300">לחץ על &apos;הוסף חשבונית&apos; כדי להוסיף</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full border-collapse text-sm" dir="rtl">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-2.5 text-right">מספר</th>
              <th className="px-4 py-2.5 text-right">תאריך</th>
              <th className="px-4 py-2.5 text-right">ספק / לקוח</th>
              {sectionType === "expense" && <th className="px-4 py-2.5 text-right">קטגוריה</th>}
              <th className="px-4 py-2.5 text-right">נטו ₪</th>
              <th className="px-4 py-2.5 text-right">מע&quot;מ ₪</th>
              <th className="px-4 py-2.5 text-right">נוצר ע&quot;י</th>
              <th className="px-4 py-2.5 text-right">נוצר ב</th>
              {canEdit && <th className="w-8 px-2" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {invoices.map((inv) => {
              const catColor = inv.expense_category ? CATEGORY_COLORS[inv.expense_category] : "";
              return (
                <tr key={inv.id} className="group transition-colors hover:bg-gray-50/60">
                  <td className={`border-r-2 ${accentBorder} px-4 py-2.5 font-mono text-xs text-gray-500`}>
                    {inv.invoice_number}
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{formatDateTime(inv.invoice_date)}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-700">{inv.counterparty_name}</td>
                  {sectionType === "expense" && (
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${catColor || "bg-gray-300"}`} />
                        <span className="text-gray-600 text-xs">
                          {inv.expense_category ? CATEGORY_LABELS[inv.expense_category] ?? inv.expense_category : "—"}
                        </span>
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-2.5 font-mono tabular-nums font-medium">{formatVatAmount(inv.net_amount)}</td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-gray-500">{formatVatAmount(inv.vat_amount)}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-400">#{inv.created_by}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-400 tabular-nums whitespace-nowrap">
                    {formatDateTime(inv.created_at)}
                  </td>
                  {canEdit && (
                    <td className="px-2 py-2">
                      <button
                        onClick={() => setConfirmId(inv.id)}
                        className="rounded p-1 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                        aria-label="מחק חשבונית"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-gray-200 bg-gray-50">
            <tr>
              <td colSpan={totalCols - (canEdit ? 3 : 2)} className="px-4 py-2.5 text-right">
                <span className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">סה&quot;כ</span>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-600">{invoices.length}</span>
                </span>
              </td>
              <td className="px-4 py-2.5 font-mono tabular-nums font-bold text-gray-800">{formatVatAmount(totalNet)}</td>
              <td className="px-4 py-2.5 font-mono tabular-nums font-semibold text-gray-600">{formatVatAmount(totalVat)}</td>
              <td colSpan={canEdit ? 3 : 2} />
            </tr>
          </tfoot>
        </table>
      </div>
      <ConfirmDialog
        open={confirmId !== null}
        title="מחיקת חשבונית"
        message="האם למחוק את החשבונית? פעולה זו אינה הפיכה."
        confirmLabel="מחק"
        cancelLabel="ביטול"
        isLoading={isDeleting}
        onConfirm={async () => {
          if (confirmId !== null) {
            await deleteInvoice(confirmId);
            setConfirmId(null);
          }
        }}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
};

VatInvoiceTable.displayName = "VatInvoiceTable";
