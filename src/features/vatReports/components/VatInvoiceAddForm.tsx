import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { FormField } from "../../../components/ui/FormField";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { vatInvoiceRowSchema, toInvoiceRowPayload, type VatInvoiceRowValues } from "../schemas";
import { EXPENSE_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS } from "../constants";
import { getVatInvoiceDefaultValues } from "../utils";
import type { VatInvoiceAddFormProps } from "../types";

export const VatInvoiceAddForm: React.FC<VatInvoiceAddFormProps> = ({
  invoiceType,
  addInvoice,
  isAdding,
  onCancel,
}) => {
  const [showOptional, setShowOptional] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<VatInvoiceRowValues>({
    resolver: zodResolver(vatInvoiceRowSchema),
    defaultValues: getVatInvoiceDefaultValues(invoiceType),
  });

  const selectedCategory = watch("expense_category");
  const categoryColor = selectedCategory ? CATEGORY_COLORS[selectedCategory] : "";

  const onSubmit = async (values: VatInvoiceRowValues) => {
    const ok = await addInvoice(toInvoiceRowPayload(values));
    if (ok) { reset(getVatInvoiceDefaultValues(invoiceType)); }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="rounded-lg border border-dashed border-gray-300 bg-gray-50/70 p-4 space-y-3"
    >
      <div className="flex flex-wrap items-end gap-3">
        {invoiceType === "expense" && (
          <FormField label="קטגוריה" error={errors.expense_category?.message} className="min-w-[180px]">
            <div className="relative flex items-center gap-2">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${categoryColor || "bg-gray-300"}`} />
              <Select {...register("expense_category")} className="flex-1">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </Select>
            </div>
          </FormField>
        )}

        <FormField label="סכום נטו ₪" error={errors.net_amount?.message} className="w-36">
          <Input
            {...register("net_amount")}
            placeholder="0.00"
            dir="ltr"
            autoFocus={invoiceType === "income"}
          />
        </FormField>

        <div className="flex items-end gap-2 pb-0.5">
          <Button type="submit" variant="primary" size="sm" isLoading={isAdding}>
            <Plus className="h-3.5 w-3.5" />
            הוסף
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              ביטול
            </Button>
          )}
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowOptional((v) => !v)}
          >
            {showOptional ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showOptional ? "הסתר פרטים" : "פרטים נוספים"}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 ${showOptional ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-wrap gap-3 pt-1">
          <FormField label="מספר חשבונית" className="w-40">
            <Input {...register("invoice_number")} placeholder="לא חובה" />
          </FormField>
          <FormField label="שם ספק / לקוח" className="w-48">
            <Input {...register("counterparty_name")} placeholder="לא חובה" />
          </FormField>
          <FormField label="תאריך חשבונית" className="w-40">
            <Input {...register("invoice_date")} type="date" />
          </FormField>
        </div>
      </div>
    </form>
  );
};

VatInvoiceAddForm.displayName = "VatInvoiceAddForm";
