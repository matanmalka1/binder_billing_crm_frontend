import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { annualReportFinancialsApi } from "../../api";
import type { IncomeLineResponse, ExpenseLineResponse } from "../../api";
import { QK } from "../../../../lib/queryKeys";
import { cn } from "../../../../utils/utils";
import { AddLineForm } from "./IncomeExpensePanelParts";
import { LineRow, INCOME_LABELS, EXPENSE_LABELS } from "../../report.constants";
import { AddExpenseLineForm } from "./AddExpenseLineForm";
import { useIncomeExpenseMutations } from "../../hooks/useIncomeExpenseMutations";
import { EditIncomeLineForm } from "./EditIncomeLineForm";
import { EditExpenseLineForm } from "./EditExpenseLineForm";

interface IncomeExpensePanelProps { reportId: number; }

const fmt = (n: string | number) =>
  Number(n).toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

export const IncomeExpensePanel: React.FC<IncomeExpensePanelProps> = ({ reportId }) => {
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: QK.tax.annualReportFinancials(reportId),
    queryFn: () => annualReportFinancialsApi.getFinancials(reportId),
    enabled: !!reportId,
  });

  const { addIncome, deleteIncome, addExpense, updateIncome, updateExpense, deleteExpense } =
    useIncomeExpenseMutations(reportId);

  if (isLoading) return <p className="py-8 text-center text-sm text-gray-400">טוען נתונים פיננסיים...</p>;

  const incomeLines: IncomeLineResponse[] = data?.income_lines ?? [];
  const expenseLines: ExpenseLineResponse[] = data?.expense_lines ?? [];
  const totalIncome = Number(data?.total_income ?? 0);
  const totalExpenses = Number(data?.recognized_expenses ?? data?.gross_expenses ?? 0);
  const taxableIncome = Number(data?.taxable_income ?? 0);

  return (
    <div className="space-y-5">
      {/* Summary */}
      {(incomeLines.length > 0 || expenseLines.length > 0) && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">סה"כ הכנסות</p>
            <p className="text-lg font-bold text-green-700">{fmt(totalIncome)}</p>
          </div>
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">סה"כ הוצאות</p>
            <p className="text-lg font-bold text-red-600">{fmt(totalExpenses)}</p>
          </div>
          <div className={cn("rounded-xl border p-4 text-center",
            taxableIncome >= 0 ? "border-blue-100 bg-blue-50" : "border-red-100 bg-red-50")}>
            <p className="text-xs text-gray-500 mb-1">הכנסה חייבת</p>
            <p className={cn("text-lg font-bold", taxableIncome >= 0 ? "text-blue-700" : "text-red-600")}>
              {fmt(taxableIncome)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Income section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-green-50 px-5 py-3">
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
            <h4 className="text-sm font-semibold text-green-800">הכנסות</h4>
            <span className="mr-auto text-xs font-medium text-green-600">{fmt(totalIncome)}</span>
          </div>
          <div className="divide-y divide-gray-50 px-1">
            {incomeLines.length === 0 && <p className="px-4 py-6 text-center text-sm text-gray-400">לא הוזנו הכנסות</p>}
            {incomeLines.map((l) => (
              <div key={l.id}>
                <LineRow label={INCOME_LABELS[l.source_type] ?? l.source_type} amount={l.amount} description={l.description}
                  onEdit={() => { setEditingExpenseId(null); setEditingIncomeId((c) => (c === l.id ? null : l.id)); }}
                  onDelete={() => deleteIncome.mutate(l.id)} isDeleting={deleteIncome.isPending} />
                {editingIncomeId === l.id && (
                  <EditIncomeLineForm line={l} typeOptions={INCOME_LABELS} isSaving={updateIncome.isPending}
                    onCancel={() => setEditingIncomeId(null)}
                    onSave={(p) => updateIncome.mutate({ lineId: l.id, payload: p }, { onSuccess: () => setEditingIncomeId(null) })} />
                )}
              </div>
            ))}
          </div>
          <div className="px-4 pb-3 pt-2">
            <AddLineForm typeOptions={INCOME_LABELS}
              onAdd={(key, amt, desc) => addIncome.mutate({ type_key: key, amount: Number(amt), description: desc })}
              isAdding={addIncome.isPending} label="הוסף הכנסה" />
          </div>
        </div>

        {/* Expense section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-red-50 px-5 py-3">
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            <h4 className="text-sm font-semibold text-red-800">הוצאות</h4>
            <span className="mr-auto text-xs font-medium text-red-600">{fmt(totalExpenses)}</span>
          </div>
          <div className="divide-y divide-gray-50 px-1">
            {expenseLines.length === 0 && <p className="px-4 py-6 text-center text-sm text-gray-400">לא הוזנו הוצאות</p>}
            {expenseLines.map((l) => (
              <div key={l.id}>
                <LineRow label={EXPENSE_LABELS[l.category] ?? l.category} amount={l.amount} description={l.description}
                  recognitionRate={l.recognition_rate} supportingDocumentRef={l.supporting_document_ref}
                  supportingDocumentId={l.supporting_document_id} supportingDocumentFilename={l.supporting_document_filename}
                  onEdit={() => { setEditingIncomeId(null); setEditingExpenseId((c) => (c === l.id ? null : l.id)); }}
                  onDelete={() => deleteExpense.mutate(l.id)} isDeleting={deleteExpense.isPending} />
                {editingExpenseId === l.id && (
                  <EditExpenseLineForm line={l} isSaving={updateExpense.isPending}
                    onCancel={() => setEditingExpenseId(null)}
                    onSave={(p) => updateExpense.mutate({ lineId: l.id, payload: p }, { onSuccess: () => setEditingExpenseId(null) })} />
                )}
              </div>
            ))}
          </div>
          <div className="px-4 pb-3 pt-2">
            <AddExpenseLineForm onAdd={(p) => addExpense.mutate(p)} isAdding={addExpense.isPending} />
          </div>
        </div>
      </div>
    </div>
  );
};

IncomeExpensePanel.displayName = "IncomeExpensePanel";
