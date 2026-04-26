import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { formatVatAmount, getVatDeductionRateClass, getVatDeductionRateLabel } from "../utils";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  DOCUMENT_TYPE_LABELS,
  VAT_EXCEPTIONAL_INVOICE_TOOLTIP,
  VAT_RATE_TYPE_LABELS,
} from "../constants";
import { formatDate, formatDateTime } from "../../../utils/utils";
import { semanticMonoToneClasses } from "../../../utils/semanticColors";
import type { VatInvoiceResponse } from "../api";

const TD = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <td className={`px-4 py-2.5 ${className}`}>{children}</td>
);

const Badge = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span className={`inline-block rounded px-1.5 py-0.5 text-xs ${color}`}>{children}</span>
);

interface VatInvoiceRowProps {
  inv: VatInvoiceResponse;
  sectionType: "income" | "expense";
  accentBorder: string;
  canEdit: boolean;
  isEditing: boolean;
  editingAny: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const VatInvoiceRow: React.FC<VatInvoiceRowProps> = ({
  inv,
  sectionType,
  accentBorder,
  canEdit,
  isEditing: _isEditing,
  editingAny,
  onEdit,
  onDelete,
}) => {
  const isExpense = sectionType === "expense";
  const catColor = inv.expense_category ? CATEGORY_COLORS[inv.expense_category] : "";

  return (
    <tr className="group transition-colors hover:bg-gray-50/60">
      <td className={`border-r-2 ${accentBorder} px-4 py-2.5 font-mono text-xs text-gray-500`}>
        {inv.invoice_number}
        {inv.is_exceptional && (
          <span
            title={VAT_EXCEPTIONAL_INVOICE_TOOLTIP}
            className="mr-1.5 rounded bg-warning-100 px-1 py-0.5 text-xs font-medium text-warning-700"
          >
            חריגה
          </span>
        )}
      </td>
      <TD className="text-gray-500">{formatDate(inv.invoice_date)}</TD>
      <TD className="font-medium text-gray-700">{inv.counterparty_name}</TD>
      <TD className="whitespace-nowrap text-xs text-gray-500">
        {inv.counterparty_id ? <span className="font-mono">{inv.counterparty_id}</span> : "—"}
      </TD>
      <TD>
        {inv.document_type ? (
          <Badge color="bg-gray-100 text-gray-600">
            {DOCUMENT_TYPE_LABELS[inv.document_type] ?? inv.document_type}
          </Badge>
        ) : "—"}
      </TD>
      <TD>
        {inv.rate_type && inv.rate_type !== "standard" ? (
          <Badge color="bg-info-50 text-info-700">
            {VAT_RATE_TYPE_LABELS[inv.rate_type] ?? inv.rate_type}
          </Badge>
        ) : "—"}
      </TD>
      {isExpense && (
        <TD>
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${catColor || "bg-gray-300"}`} />
            <span className="text-xs text-gray-600">
              {inv.expense_category ? (CATEGORY_LABELS[inv.expense_category] ?? inv.expense_category) : "—"}
            </span>
          </span>
        </TD>
      )}
      <TD className="whitespace-nowrap">
        <span className={getVatDeductionRateClass(inv.deduction_rate)}>
          {getVatDeductionRateLabel(inv.deduction_rate)}
        </span>
      </TD>
      <TD className="font-medium font-mono tabular-nums">{formatVatAmount(inv.net_amount)}</TD>
      <TD className="font-mono tabular-nums text-gray-500">{formatVatAmount(inv.vat_amount)}</TD>
      {isExpense && (
        <TD className={`font-mono tabular-nums font-semibold ${semanticMonoToneClasses.positive}`}>
          {formatVatAmount(Number(inv.vat_amount) * Number(inv.deduction_rate))}
        </TD>
      )}
      <TD className="font-mono text-xs text-gray-400">#{inv.created_by}</TD>
      <TD className="whitespace-nowrap text-xs tabular-nums text-gray-400">{formatDateTime(inv.created_at)}</TD>
      {canEdit && (
        <td className="px-2 py-2">
          <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onEdit}
              disabled={editingAny}
              className="p-1 text-gray-300 hover:bg-info-50 hover:text-info-500"
              aria-label="ערוך חשבונית"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              disabled={editingAny}
              className="p-1 text-gray-300 hover:bg-negative-50 hover:text-negative-500"
              aria-label="מחק חשבונית"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </td>
      )}
    </tr>
  );
};

VatInvoiceRow.displayName = "VatInvoiceRow";
