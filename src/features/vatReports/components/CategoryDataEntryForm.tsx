import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../../components/ui/Button";
import {
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  INCOME_KEY,
  categoryEntryDefaultValues,
  type CategoryEntryFormValues,
  type ExpenseCategoryKey,
} from "../schemas";
import { useAddCategoryInvoices } from "../hooks/useAddCategoryInvoices";

const VAT_RATE = 0.18;

const amountField = z
  .string()
  .trim()
  .refine((v) => v === "" || (!isNaN(Number(v)) && Number(v) >= 0), {
    message: "סכום לא תקין",
  });

const rowSchema = z.object({ net_amount: amountField, vat_amount: amountField });

const flatSchema = z.object({
  income: rowSchema,
  categories: z.object(
    Object.fromEntries(EXPENSE_CATEGORIES.map((k) => [k, rowSchema])) as Record<
      ExpenseCategoryKey,
      typeof rowSchema
    >,
  ),
});

interface Props {
  workItemId: number;
  period: string;
  onSaved: () => void;
}

interface AmountRowProps {
  label: string;
  netProps: React.InputHTMLAttributes<HTMLInputElement>;
  vatProps: React.InputHTMLAttributes<HTMLInputElement>;
  netError?: string;
  vatError?: string;
  onNetChange: (net: string) => void;
}

const AmountRow: React.FC<AmountRowProps> = ({
  label,
  netProps,
  vatProps,
  netError,
  vatError,
  onNetChange,
}) => {
  const { onChange: originalNetOnChange, ...restNetProps } = netProps as React.InputHTMLAttributes<HTMLInputElement> & { onChange?: React.ChangeEventHandler<HTMLInputElement> };

  const handleNetChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    originalNetOnChange?.(e);
    onNetChange(e.target.value);
  };

  return (
    <tr className="border-b border-gray-50">
      <td className="py-2 pr-1 text-sm text-gray-700 font-medium">{label}</td>
      <td className="py-1 px-1">
        <div>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono tabular-nums focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            {...restNetProps}
            onChange={handleNetChange}
          />
          {netError && <p className="mt-0.5 text-xs text-red-600">{netError}</p>}
        </div>
      </td>
      <td className="py-1 px-1">
        <div>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm font-mono tabular-nums focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            {...vatProps}
          />
          {vatError && <p className="mt-0.5 text-xs text-red-600">{vatError}</p>}
        </div>
      </td>
    </tr>
  );
};
AmountRow.displayName = "AmountRow";

export const CategoryDataEntryForm: React.FC<Props> = ({ workItemId, period, onSaved }) => {
  const { submit, isLoading } = useAddCategoryInvoices(workItemId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryEntryFormValues>({
    defaultValues: categoryEntryDefaultValues(),
    resolver: zodResolver(flatSchema),
  });

  const autoVat = (net: string, field: Parameters<typeof setValue>[0]) => {
    const n = Number(net);
    if (!isNaN(n) && n >= 0) {
      setValue(field, String((n * VAT_RATE).toFixed(2)));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const ok = await submit(values, period);
    if (ok) {
      reset(categoryEntryDefaultValues());
      onSaved();
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" dir="rtl">
      <p className="text-xs text-gray-500">
        הזן סכומים לפי קטגוריה. מע"מ מחושב אוטומטית (18%). שורות ריקות יתעלמו.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-right text-xs text-gray-500">
              <th className="py-1.5 pr-1 font-medium w-1/3">קטגוריה</th>
              <th className="py-1.5 px-1 font-medium">נטו (₪)</th>
              <th className="py-1.5 px-1 font-medium">מע"מ (₪)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50/50">
              <td colSpan={3} className="pt-2 pb-1 pr-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                עסקאות
              </td>
            </tr>
            <AmountRow
              label={CATEGORY_LABELS[INCOME_KEY]}
              netProps={register("income.net_amount")}
              vatProps={register("income.vat_amount")}
              netError={errors.income?.net_amount?.message}
              vatError={errors.income?.vat_amount?.message}
              onNetChange={(net) => autoVat(net, "income.vat_amount")}
            />

            <tr className="bg-orange-50/50">
              <td colSpan={3} className="pt-3 pb-1 pr-1 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                תשומות
              </td>
            </tr>
            {EXPENSE_CATEGORIES.map((cat) => (
              <AmountRow
                key={cat}
                label={CATEGORY_LABELS[cat]}
                netProps={register(`categories.${cat}.net_amount`)}
                vatProps={register(`categories.${cat}.vat_amount`)}
                netError={errors.categories?.[cat]?.net_amount?.message}
                vatError={errors.categories?.[cat]?.vat_amount?.message}
                onNetChange={(net) => autoVat(net, `categories.${cat}.vat_amount`)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" size="sm" isLoading={isLoading}>
          שמירה
        </Button>
      </div>
    </form>
  );
};

CategoryDataEntryForm.displayName = "CategoryDataEntryForm";
