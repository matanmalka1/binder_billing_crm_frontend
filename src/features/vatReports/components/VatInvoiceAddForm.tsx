import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { FormField } from "../../../components/ui/inputs/FormField";
import { Input } from "../../../components/ui/inputs/Input";
import { SelectDropdown } from "../../../components/ui/inputs/SelectDropdown";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import {
  vatInvoiceRowSchema,
  toInvoiceRowPayload,
  type VatInvoiceRowValues,
} from "../schemas/invoice.schema";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_LABELS,
  DEDUCTION_RATES,
  VAT_RATE_TYPES,
  DOCUMENT_TYPES,
  DEFAULT_RATE_TYPE,
} from "../constants";
import { getVatInvoiceDefaultValues } from "../utils";
import { getVatRateTypeLabel, getDocumentTypeLabel } from "../../../utils/enums";
import type { VatInvoiceAddFormProps } from "../types";

const NUMERIC_KEYS = ["ArrowLeft", "ArrowRight", "Delete", "Backspace", "Enter", "Tab"];

const blockNonNumeric = (e: React.KeyboardEvent, allowDot = false) => {
  const pattern = allowDot ? /[\d.]/ : /[\d]/;
  if (!pattern.test(e.key) && !NUMERIC_KEYS.includes(e.key)) e.preventDefault();
};

export const VatInvoiceAddForm: React.FC<VatInvoiceAddFormProps> = ({
  invoiceType,
  addInvoice,
  isAdding,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<VatInvoiceRowValues>({
    resolver: zodResolver(vatInvoiceRowSchema),
    defaultValues: {
      ...getVatInvoiceDefaultValues(invoiceType),
      rate_type: DEFAULT_RATE_TYPE,
    },
  });

  const isExpense = invoiceType === "expense";
  const selectedCategory = watch("expense_category");
  const selectedDocumentType = watch("document_type");
  const deductionRate =
    selectedCategory !== undefined ? (DEDUCTION_RATES[selectedCategory] ?? null) : null;
  const requiresCounterpartyId = isExpense && selectedDocumentType === "tax_invoice";

  const onSubmit = async (values: VatInvoiceRowValues) => {
    const ok = await addInvoice(toInvoiceRowPayload(values));
    if (ok) reset({ ...getVatInvoiceDefaultValues(invoiceType), rate_type: DEFAULT_RATE_TYPE });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="rounded-lg border border-dashed border-gray-300 bg-gray-50/70 p-4"
    >
      <div className="flex flex-wrap items-end gap-x-3 gap-y-3">
        {/* Required: amount */}
        <FormField label="סכום נטו ₪" error={errors.net_amount?.message} className="w-32 shrink-0">
          <Input
            {...register("net_amount")}
            placeholder="0.00"
            dir="ltr"
            inputMode="decimal"
            autoFocus={!isExpense}
            onKeyDown={(e) => blockNonNumeric(e, true)}
          />
        </FormField>

        {/* Required: date */}
        <FormField label="תאריך חשבונית" error={errors.invoice_date?.message} className="w-36 shrink-0">
          <Controller
            control={control}
            name="invoice_date"
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} onBlur={field.onBlur} noWrapper />
            )}
          />
        </FormField>

        {/* VAT type */}
        <FormField label='סוג מע"מ' className="w-32 shrink-0">
          <Controller
            control={control}
            name="rate_type"
            render={({ field }) => (
              <SelectDropdown
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={VAT_RATE_TYPES.map((rt) => ({
                  value: rt,
                  label: getVatRateTypeLabel(rt),
                }))}
              />
            )}
          />
        </FormField>

        {/* Expense-only: category */}
        {isExpense && (
          <FormField
            label="קטגוריה"
            error={errors.expense_category?.message}
            className="w-44 shrink-0"
          >
            <Controller
              control={control}
              name="expense_category"
              render={({ field }) => (
                <SelectDropdown
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={EXPENSE_CATEGORIES.map((cat) => ({
                    value: cat,
                    label: CATEGORY_LABELS[cat],
                  }))}
                />
              )}
            />
          </FormField>
        )}

        {/* Expense-only: document type */}
        {isExpense && (
          <FormField
            label="סוג מסמך"
            error={errors.document_type?.message}
            className="w-40 shrink-0"
          >
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
                    ...DOCUMENT_TYPES.map((dt) => ({
                      value: dt,
                      label: getDocumentTypeLabel(dt),
                    })),
                  ]}
                />
              )}
            />
          </FormField>
        )}

        {/* Optional: invoice number */}
        <FormField label="מספר חשבונית" className="w-36 shrink-0">
          <Input {...register("invoice_number")} placeholder="לא חובה" />
        </FormField>

        {/* Optional: counterparty name */}
        <FormField label="שם ספק / לקוח" className="w-44 shrink-0">
          <Input {...register("counterparty_name")} placeholder="לא חובה" />
        </FormField>

        {/* Conditional: counterparty ID (tax invoice expense only) */}
        {requiresCounterpartyId && (
          <FormField
            label="מספר עוסק של הספק"
            error={errors.counterparty_id?.message}
            className="w-36 shrink-0"
          >
            <Input
              {...register("counterparty_id")}
              placeholder="9 ספרות"
              dir="ltr"
              inputMode="numeric"
              onKeyDown={(e) => blockNonNumeric(e, false)}
            />
          </FormField>
        )}

        {/* Deduction rate hint inline with submit */}
        <div className="flex items-end gap-3 pb-0.5">
          {isExpense && deductionRate !== null && deductionRate < 1 && (
            <span className={`text-xs font-medium ${deductionRate === 0 ? "text-negative-600" : "text-warning-600"}`}>
              {deductionRate === 0 ? "⚠️ ניכוי אסור" : `ניכוי ${(deductionRate * 100).toFixed(0)}%`}
            </span>
          )}
          <Button type="submit" variant="primary" size="sm" isLoading={isAdding}>
            <Plus className="h-3.5 w-3.5" />
            הוסף
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              ביטול
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

VatInvoiceAddForm.displayName = "VatInvoiceAddForm";
