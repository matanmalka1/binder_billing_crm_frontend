import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { vatInvoiceEditSchema, toInvoiceEditPayload, type VatInvoiceEditValues } from "../schemas";
import { EXPENSE_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from "../constants";
import { toDateInputValue } from "../utils";
import type { VatInvoiceEditRowProps } from "../types";

export const VatInvoiceEditRow: React.FC<VatInvoiceEditRowProps> = ({
  invoice,
  sectionType,
  accentBorder,
  onSave,
  onCancel,
  isSaving,
}) => {
  const { register, handleSubmit } = useForm<VatInvoiceEditValues>({
    resolver: zodResolver(vatInvoiceEditSchema),
    defaultValues: {
      net_amount: String(invoice.net_amount),
      expense_category: invoice.expense_category ?? undefined,
      invoice_number: invoice.invoice_number,
      invoice_date: toDateInputValue(invoice.invoice_date),
      counterparty_name: invoice.counterparty_name,
    },
  });

  const onSubmit = async (values: VatInvoiceEditValues) => {
    const ok = await onSave(toInvoiceEditPayload(values));
    if (ok) onCancel();
  };

  const selectedCategory = invoice.expense_category ?? EXPENSE_CATEGORIES[0];
  const catColor = selectedCategory ? CATEGORY_COLORS[selectedCategory] : "";

  return (
    <tr className="bg-blue-50/40" onKeyDown={(e) => e.key === "Escape" && onCancel()}>
      <td className={`border-r-2 ${accentBorder} px-2 py-1.5`}>
        <Input {...register("invoice_number")} className="h-7 w-28 text-xs px-1 font-mono" />
      </td>
      <td className="px-2 py-1.5">
        <Input {...register("invoice_date")} type="date" className="h-7 w-32 text-xs px-1" />
      </td>
      <td className="px-2 py-1.5">
        <Input {...register("counterparty_name")} className="h-7 w-36 text-xs px-1" />
      </td>
      {sectionType === "expense" && (
        <td className="px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${catColor || "bg-gray-300"}`} />
            <Select {...register("expense_category")} className="h-7 text-xs flex-1">
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </Select>
          </div>
        </td>
      )}
      <td className="px-2 py-1.5">
        <Input {...register("net_amount")} dir="ltr" className="h-7 w-24 text-xs px-1 font-mono" />
      </td>
      <td className="px-2 py-1.5 text-xs text-gray-400">—</td>
      <td className="px-2 py-1.5 text-xs text-gray-400 font-mono">#{invoice.created_by}</td>
      <td className="px-2 py-1.5" />
      <td className="px-2 py-1.5">
        <div className="flex gap-1">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="rounded p-1 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
            aria-label="שמור"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
            aria-label="ביטול"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

VatInvoiceEditRow.displayName = "VatInvoiceEditRow";
