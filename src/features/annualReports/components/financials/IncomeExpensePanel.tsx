import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { annualReportFinancialsApi } from "../../../../api/annualReport.financials.api";
import type { IncomeLineResponse, ExpenseLineResponse } from "../../../../api/annualReport.api";
import { QK } from "../../../../lib/queryKeys";
import { cn } from "../../../../utils/utils";
import { AddLineForm } from "./IncomeExpensePanelParts";
import { LineRow, INCOME_LABELS, EXPENSE_LABELS } from "../../report.constants";
import { AddExpenseLineForm } from "./AddExpenseLineForm";
import { useIncomeExpenseMutations } from "../../hooks/useIncomeExpenseMutations";
import { EditIncomeLineForm } from "./EditIncomeLineForm";
import { EditExpenseLineForm } from "./EditExpenseLineForm";

interface IncomeExpensePanelProps { reportId: number; }

export const IncomeExpensePanel: React.FC<IncomeExpensePanelProps> = ({ reportId }) => {
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: QK.tax.annualReportFinancials(reportId),
    queryFn: () => annualReportFinancialsApi.getFinancials(reportId),
  });

  const { addIncome, deleteIncome, addExpense, updateIncome, updateExpense, deleteExpense } = useIncomeExpenseMutations(reportId);

  if (isLoading) return <p className="text-sm text-gray-400 py-2">טוען נתונים פיננסיים...</p>;

  const incomeLines: IncomeLineResponse[] = data?.income_lines ?? [];
  const expenseLines: ExpenseLineResponse[] = data?.expense_lines ?? [];
  const totalIncome = data?.total_income ?? 0;
  const totalExpenses = data?.recognized_expenses ?? data?.gross_expenses ?? 0;
  const taxableIncome = data?.taxable_income ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">הכנסות</h4>
        {incomeLines.length === 0 && <p className="text-xs text-gray-400">לא הוזנו הכנסות</p>}
        {incomeLines.map((l) => (
          <div key={l.id}>
            <LineRow label={INCOME_LABELS[l.source_type] ?? l.source_type}
              amount={l.amount} description={l.description}
              onEdit={() => {
                setEditingExpenseId(null);
                setEditingIncomeId((current) => (current === l.id ? null : l.id));
              }}
              onDelete={() => deleteIncome.mutate(l.id)} isDeleting={deleteIncome.isPending} />
            {editingIncomeId === l.id ? (
              <EditIncomeLineForm
                line={l}
                typeOptions={INCOME_LABELS}
                isSaving={updateIncome.isPending}
                onCancel={() => setEditingIncomeId(null)}
                onSave={(payload) => {
                  updateIncome.mutate(
                    { lineId: l.id, payload },
                    { onSuccess: () => setEditingIncomeId(null) },
                  );
                }}
              />
            ) : null}
          </div>
        ))}
        <AddLineForm typeOptions={INCOME_LABELS}
          onAdd={(key, amt, desc) => addIncome.mutate({ type_key: key, amount: amt, description: desc })}
          isAdding={addIncome.isPending} label="הוסף הכנסה" />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">הוצאות</h4>
        {expenseLines.length === 0 && <p className="text-xs text-gray-400">לא הוזנו הוצאות</p>}
        {expenseLines.map((l) => (
          <div key={l.id}>
            <LineRow label={EXPENSE_LABELS[l.category] ?? l.category}
              amount={l.amount} description={l.description}
              recognitionRate={l.recognition_rate} supportingDocumentRef={l.supporting_document_ref}
              supportingDocumentId={l.supporting_document_id} supportingDocumentFilename={l.supporting_document_filename}
              onEdit={() => {
                setEditingIncomeId(null);
                setEditingExpenseId((current) => (current === l.id ? null : l.id));
              }}
              onDelete={() => deleteExpense.mutate(l.id)} isDeleting={deleteExpense.isPending} />
            {editingExpenseId === l.id ? (
              <EditExpenseLineForm
                line={l}
                isSaving={updateExpense.isPending}
                onCancel={() => setEditingExpenseId(null)}
                onSave={(payload) => {
                  updateExpense.mutate(
                    { lineId: l.id, payload },
                    { onSuccess: () => setEditingExpenseId(null) },
                  );
                }}
              />
            ) : null}
          </div>
        ))}
        <AddExpenseLineForm onAdd={(p) => addExpense.mutate(p)} isAdding={addExpense.isPending} />
      </div>

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

IncomeExpensePanel.displayName = "IncomeExpensePanel";
