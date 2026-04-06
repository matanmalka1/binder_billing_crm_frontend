import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { Input } from "../../../components/ui/inputs/Input";
import { SelectDropdown } from "../../../components/ui/inputs/SelectDropdown";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import {
  vatInvoiceEditSchema,
  isCounterpartyIdType,
  toInvoiceEditPayload,
  type VatInvoiceEditValues,
} from "../schemas/invoice.schema";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "../constants";
import {
  formatVatAmount,
  getVatDeductionRateClass,
  getVatDeductionRateLabel,
  toDateInputValue,
} from "../utils";
import type { VatInvoiceEditRowProps } from "../types";
import { semanticMonoToneClasses } from "../../../utils/semanticColors";

export const VatInvoiceEditRow: React.FC<VatInvoiceEditRowProps> = ({
  invoice,
  sectionType,
  accentBorder,
  onSave,
  onCancel,
  isSaving,
}) => {
  const counterpartyIdType = isCounterpartyIdType(invoice.counterparty_id_type)
    ? invoice.counterparty_id_type
    : undefined;

  const { register, handleSubmit, control } = useForm<VatInvoiceEditValues>({
    resolver: zodResolver(vatInvoiceEditSchema),
    defaultValues: {
      net_amount: String(invoice.net_amount),
      expense_category: invoice.expense_category ?? undefined,
      invoice_number: invoice.invoice_number,
      invoice_date: toDateInputValue(invoice.invoice_date),
      counterparty_name: invoice.counterparty_name,
      counterparty_id: invoice.counterparty_id ?? undefined,
      counterparty_id_type: counterpartyIdType,
    },
  });

  const onSubmit: SubmitHandler<VatInvoiceEditValues> = async (values) => {
    const ok = await onSave(toInvoiceEditPayload(values));
    if (ok) onCancel();
  };

  const selectedCategory = invoice.expense_category ?? EXPENSE_CATEGORIES[0];
  const catColor = selectedCategory ? CATEGORY_COLORS[selectedCategory] : "";
  const handleEscapeKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <tr className="bg-info-50/40">
      <td className={`border-r-2 ${accentBorder} px-2 py-1.5`}>
        <Input
          {...register("invoice_number")}
          onKeyDown={handleEscapeKeyDown}
          className="h-7 w-28 text-xs px-1 font-mono"
        />
      </td>
      <td className="px-2 py-1.5 w-32">
        <Controller
          control={control}
          name="invoice_date"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              onKeyDown={handleEscapeKeyDown}
              compact
              noWrapper
              usePortal
            />
          )}
        />
      </td>
      <td className="px-2 py-1.5">
        <Input
          {...register("counterparty_name")}
          onKeyDown={handleEscapeKeyDown}
          className="h-7 w-36 text-xs px-1"
        />
      </td>
      <td className="px-2 py-1.5">
        <Input
          {...register("counterparty_id")}
          onKeyDown={handleEscapeKeyDown}
          className="h-7 w-28 text-xs px-1 font-mono"
          placeholder="—"
          dir="ltr"
        />
      </td>
      <td className="px-2 py-1.5 text-xs text-gray-400">—</td>
      <td className="px-2 py-1.5 text-xs text-gray-400">—</td>
      {sectionType === "expense" && (
        <td className="px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${catColor || "bg-gray-300"}`}
            />
            <Controller
              control={control}
              name="expense_category"
              render={({ field }) => (
                <SelectDropdown
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onKeyDown={handleEscapeKeyDown}
                  className="h-7 text-xs flex-1"
                  options={EXPENSE_CATEGORIES.map((cat) => ({
                    value: cat,
                    label: CATEGORY_LABELS[cat],
                  }))}
                />
              )}
            />
          </div>
        </td>
      )}
      <td className="px-2 py-1.5 whitespace-nowrap">
        <span className={getVatDeductionRateClass(invoice.deduction_rate)}>
          {getVatDeductionRateLabel(invoice.deduction_rate)}
        </span>
      </td>
      <td className="px-2 py-1.5">
        <Input
          {...register("net_amount")}
          dir="ltr"
          className="h-7 w-24 text-xs px-1 font-mono"
          inputMode="decimal"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              onCancel();
              return;
            }
            if (
              !/[\d.]/.test(e.key) &&
              ![
                "ArrowLeft",
                "ArrowRight",
                "Delete",
                "Backspace",
                "Tab",
              ].includes(e.key)
            )
              e.preventDefault();
          }}
        />
      </td>
      <td className="px-2 py-1.5 text-xs text-gray-400">—</td>
      {sectionType === "expense" && (
        <td className={`px-2 py-1.5 font-mono text-xs ${semanticMonoToneClasses.positive}`}>
          {formatVatAmount(Number(invoice.vat_amount) * Number(invoice.deduction_rate))}
        </td>
      )}
      <td className="px-2 py-1.5 text-xs text-gray-400 font-mono">
        #{invoice.created_by}
      </td>
      <td className="px-2 py-1.5 text-xs text-gray-400">—</td>
      <td className="px-2 py-1.5">
        <div className="flex gap-1">
          <button
            onClick={handleSubmit(onSubmit)}
            onKeyDown={handleEscapeKeyDown}
            disabled={isSaving}
            className="rounded p-1 text-positive-600 hover:bg-positive-50 disabled:opacity-50"
            aria-label="שמור"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            onKeyDown={handleEscapeKeyDown}
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
