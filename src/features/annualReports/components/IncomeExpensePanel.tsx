import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import {
  annualReportsApi,
  type IncomeSourceType,
  type ExpenseCategoryType,
  type IncomeLineResponse,
  type ExpenseLineResponse,
} from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { showErrorToast, cn } from "../../../utils/utils";

const INCOME_LABELS: Record<IncomeSourceType, string> = {
  business: "הכנסות עסק",
  salary: "משכורת",
  interest: "ריבית",
  dividends: "דיבידנד",
  capital_gains: "רווחי הון",
  rental: "שכירות",
  foreign: 'הכנסות מחו"ל',
  pension: "פנסיה / קצבה",
  other: "אחר",
};

const EXPENSE_LABELS: Record<ExpenseCategoryType, string> = {
  office_rent: "שכירות משרד",
  professional_services: "שירותים מקצועיים",
  salaries: "שכר עבודה",
  depreciation: "פחת",
  vehicle: "רכב",
  marketing: "שיווק ופרסום",
  insurance: "ביטוח",
  communication: "תקשורת",
  travel: "נסיעות",
  training: "הכשרה מקצועית",
  bank_fees: "עמלות בנק",
  other: "אחר",
};

interface LineRowProps {
  label: string;
  amount: number;
  description?: string | null;
  onDelete: () => void;
  isDeleting: boolean;
}

const LineRow: React.FC<LineRowProps> = ({ label, amount, description, onDelete, isDeleting }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 text-sm">
    <div className="flex-1 min-w-0">
      <span className="font-medium text-gray-800">{label}</span>
      {description && <span className="text-gray-500 mr-1">— {description}</span>}
    </div>
    <div className="flex items-center gap-2 mr-2">
      <span className="text-gray-700 font-mono">₪{amount.toLocaleString("he-IL")}</span>
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="text-red-400 hover:text-red-600 disabled:opacity-40 p-0.5"
        aria-label="מחק"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
);

interface AddLineFormProps {
  typeOptions: Record<string, string>;
  onAdd: (typeKey: string, amount: number, description?: string) => void;
  isAdding: boolean;
  label: string;
}

const AddLineForm: React.FC<AddLineFormProps> = ({ typeOptions, onAdd, isAdding, label }) => {
  const [open, setOpen] = useState(false);
  const [typeKey, setTypeKey] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => { setTypeKey(""); setAmount(""); setDescription(""); setError(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeKey) { setError("יש לבחור סוג"); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) { setError("יש להזין סכום חיובי"); return; }
    onAdd(typeKey, parsed, description || undefined);
    reset();
    setOpen(false);
  };

  if (!open) {
    return (
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)} className="gap-1 text-xs mt-1">
        <Plus className="h-3.5 w-3.5" />
        {label}
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <select
        value={typeKey}
        onChange={(e) => setTypeKey(e.target.value)}
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white"
      >
        <option value="" disabled>בחר סוג...</option>
        {Object.entries(typeOptions).map(([key, lbl]) => (
          <option key={key} value={key}>{lbl}</option>
        ))}
      </select>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        min="0"
        step="0.01"
        placeholder="סכום ₪"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="תיאור (אופציונלי)"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" isLoading={isAdding} className="flex-1">הוסף</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => { reset(); setOpen(false); }}>
          ביטול
        </Button>
      </div>
    </form>
  );
};

interface IncomeExpensePanelProps {
  reportId: number;
}

export const IncomeExpensePanel: React.FC<IncomeExpensePanelProps> = ({ reportId }) => {
  const queryClient = useQueryClient();
  const qk = QK.tax.annualReportFinancials(reportId);

  const { data, isLoading } = useQuery({
    queryKey: qk,
    queryFn: () => annualReportsApi.getFinancials(reportId),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: qk });
    void queryClient.invalidateQueries({ queryKey: QK.tax.annualReportReadiness(reportId) });
    void queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.detail(reportId) });
  };

  const addIncomeMutation = useMutation({
    mutationFn: ({ type_key, amount, description }: { type_key: string; amount: number; description?: string }) =>
      annualReportsApi.addIncomeLine(reportId, {
        source_type: type_key as IncomeSourceType,
        amount,
        description,
      }),
    onSuccess: () => { toast.success("הכנסה נוספה"); invalidate(); },
    onError: (err) => showErrorToast(err, "שגיאה בהוספת הכנסה"),
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: (lineId: number) => annualReportsApi.deleteIncomeLine(reportId, lineId),
    onSuccess: () => { toast.success("הכנסה נמחקה"); invalidate(); },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת הכנסה"),
  });

  const addExpenseMutation = useMutation({
    mutationFn: ({ type_key, amount, description }: { type_key: string; amount: number; description?: string }) =>
      annualReportsApi.addExpenseLine(reportId, {
        category: type_key as ExpenseCategoryType,
        amount,
        description,
      }),
    onSuccess: () => { toast.success("הוצאה נוספה"); invalidate(); },
    onError: (err) => showErrorToast(err, "שגיאה בהוספת הוצאה"),
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (lineId: number) => annualReportsApi.deleteExpenseLine(reportId, lineId),
    onSuccess: () => { toast.success("הוצאה נמחקה"); invalidate(); },
    onError: (err) => showErrorToast(err, "שגיאה במחיקת הוצאה"),
  });

  if (isLoading) return <p className="text-sm text-gray-400 py-2">טוען נתונים פיננסיים...</p>;

  const incomeLines: IncomeLineResponse[] = data?.income_lines ?? [];
  const expenseLines: ExpenseLineResponse[] = data?.expense_lines ?? [];
  const totalIncome = data?.total_income ?? 0;
  const totalExpenses = data?.total_expenses ?? 0;
  const taxableIncome = data?.taxable_income ?? 0;

  return (
    <div className="space-y-4">
      {/* Income */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">הכנסות</h4>
        {incomeLines.length === 0 && (
          <p className="text-xs text-gray-400">לא הוזנו הכנסות</p>
        )}
        {incomeLines.map((l) => (
          <LineRow
            key={l.id}
            label={INCOME_LABELS[l.source_type] ?? l.source_type}
            amount={l.amount}
            description={l.description}
            onDelete={() => deleteIncomeMutation.mutate(l.id)}
            isDeleting={deleteIncomeMutation.isPending}
          />
        ))}
        <AddLineForm
          typeOptions={INCOME_LABELS}
          onAdd={(key, amt, desc) => addIncomeMutation.mutate({ type_key: key, amount: amt, description: desc })}
          isAdding={addIncomeMutation.isPending}
          label="הוסף הכנסה"
        />
      </div>

      {/* Expenses */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">הוצאות</h4>
        {expenseLines.length === 0 && (
          <p className="text-xs text-gray-400">לא הוזנו הוצאות</p>
        )}
        {expenseLines.map((l) => (
          <LineRow
            key={l.id}
            label={EXPENSE_LABELS[l.category] ?? l.category}
            amount={l.amount}
            description={l.description}
            onDelete={() => deleteExpenseMutation.mutate(l.id)}
            isDeleting={deleteExpenseMutation.isPending}
          />
        ))}
        <AddLineForm
          typeOptions={EXPENSE_LABELS}
          onAdd={(key, amt, desc) => addExpenseMutation.mutate({ type_key: key, amount: amt, description: desc })}
          isAdding={addExpenseMutation.isPending}
          label="הוסף הוצאה"
        />
      </div>

      {/* Summary */}
      {(incomeLines.length > 0 || expenseLines.length > 0) && (
        <div className="rounded-md bg-gray-50 border border-gray-200 p-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">סה"כ הכנסות</span>
            <span className="font-medium text-green-700">₪{totalIncome.toLocaleString("he-IL")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">סה"כ הוצאות</span>
            <span className="font-medium text-red-600">₪{totalExpenses.toLocaleString("he-IL")}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1 font-semibold">
            <span className="text-gray-700">הכנסה חייבת</span>
            <span className={cn(taxableIncome >= 0 ? "text-blue-700" : "text-red-600")}>
              ₪{taxableIncome.toLocaleString("he-IL")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
