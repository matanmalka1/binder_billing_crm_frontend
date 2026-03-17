import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { FormField } from "../../../components/ui/FormField";
import { Input } from "../../../components/ui/Input";
import { SelectDropdown } from "../../../components/ui/SelectDropdown";
import { vatInvoiceRowSchema, toInvoiceRowPayload, type VatInvoiceRowValues } from "../schemas";
import { EXPENSE_CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, DEDUCTION_RATES } from "../constants";
import { getVatInvoiceDefaultValues } from "../utils";
import { getVatRateTypeLabel, getDocumentTypeLabel } from "../../../utils/enums";
import type { VatInvoiceAddFormProps } from "../types";

const VAT_RATE_TYPES = ["standard", "exempt", "zero_rate"] as const;
const DOCUMENT_TYPES = ["tax_invoice", "transaction_invoice", "receipt", "consolidated", "self_invoice"] as const;

export const VatInvoiceAddForm: React.FC<VatInvoiceAddFormProps> = ({
  invoiceType,
  addInvoice,
  isAdding,
  onCancel,
}) => {
  const [showOptional, setShowOptional] = useState(false);

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<VatInvoiceRowValues>({
    resolver: zodResolver(vatInvoiceRowSchema),
    defaultValues: { ...getVatInvoiceDefaultValues(invoiceType), rate_type: "standard" },
  });

  const selectedCategory = watch("expense_category");
  const categoryColor = selectedCategory ? CATEGORY_COLORS[selectedCategory] : "";
  const deductionRate = selectedCategory !== undefined ? (DEDUCTION_RATES[selectedCategory] ?? null) : null;

  const onSubmit = async (values: VatInvoiceRowValues) => {
    const ok = await addInvoice(toInvoiceRowPayload(values));
    if (ok) { reset({ ...getVatInvoiceDefaultValues(invoiceType), rate_type: "standard" }); }
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
              <Controller
                control={control}
                name="expense_category"
                render={({ field }) => (
                  <SelectDropdown
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="flex-1"
                    options={EXPENSE_CATEGORIES.map((cat) => ({ value: cat, label: CATEGORY_LABELS[cat] }))}
                  />
                )}
              />
            </div>
          </FormField>
        )}

        <FormField label='סוג מע"מ' className="min-w-[140px]">
          <Controller
            control={control}
            name="rate_type"
            render={({ field }) => (
              <SelectDropdown
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={VAT_RATE_TYPES.map((rt) => ({ value: rt, label: getVatRateTypeLabel(rt) }))}
              />
            )}
          />
        </FormField>

        {invoiceType === "expense" && (
          <FormField label="סוג מסמך" error={errors.document_type?.message} className="min-w-[160px]">
            <Controller
              control={control}
              name="document_type"
              render={({ field }) => (
                <SelectDropdown
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={[
                    { value: "", label: "— בחר —" },
                    ...DOCUMENT_TYPES.map((dt) => ({ value: dt, label: getDocumentTypeLabel(dt) })),
                  ]}
                />
              )}
            />
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

      {/* Deduction rate info for expense */}
      {invoiceType === "expense" && deductionRate !== null && (
        <div className={`text-xs font-medium ${deductionRate === 0 ? "text-red-600" : "text-gray-500"}`}>
          {deductionRate === 0
            ? "⚠️ ניכוי אסור"
            : deductionRate < 1
              ? `שיעור ניכוי: ${(deductionRate * 100).toFixed(2)}%`
              : null}
        </div>
      )}

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
