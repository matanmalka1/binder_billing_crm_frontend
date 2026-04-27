import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Button } from "../../../../components/ui/primitives/Button";
import { annualReportFinancialsApi, annualReportsQK } from "../../api";
import type { IncomeLineResponse, ExpenseLineResponse } from "../../api";
import { cn, formatCurrencyILS as fmt } from "../../../../utils/utils";
import { toast } from "../../../../utils/toast";
import { useRole } from "../../../../hooks/useRole";
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
  const [showForceConfirm, setShowForceConfirm] = useState(false);
  const { isAdvisor } = useRole();
  const queryClient = useQueryClient();

  const autoPopulateMutation = useMutation({
    mutationFn: (force: boolean) => annualReportFinancialsApi.autoPopulate(reportId, force),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: annualReportsQK.financials(reportId) });
      setShowForceConfirm(false);
      toast.success(
        `נוצרו ${result.income_lines_created} שורות הכנסה ו-${result.expense_lines_created} שורות הוצאה מנתוני מע"מ`,
      );
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        setShowForceConfirm(true);
      } else {
        const msg =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
          "שגיאה במילוי אוטומטי מנתוני מע\"מ";
        toast.error(msg);
      }
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: annualReportsQK.financials(reportId),
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
      {isAdvisor && (
        <div className="flex justify-end gap-2">
          {showForceConfirm ? (
            <>
              <span className="self-center text-sm text-warning-700">קיימות שורות — למחוק ולמלא מחדש?</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForceConfirm(false)}>
                ביטול
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => autoPopulateMutation.mutate(true)}
                isLoading={autoPopulateMutation.isPending}
              >
                מחק ומלא מחדש
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => autoPopulateMutation.mutate(false)}
              isLoading={autoPopulateMutation.isPending}
              className="bg-info-600 hover:bg-info-700"
            >
              {`מלא מנתוני מע"מ`}
            </Button>
          )}
        </div>
      )}
      {/* Summary */}
      {(incomeLines.length > 0 || expenseLines.length > 0) && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-positive-100 bg-positive-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">סה"כ הכנסות</p>
            <p className="text-lg font-bold text-positive-700">{fmt(totalIncome)}</p>
          </div>
          <div className="rounded-xl border border-negative-100 bg-negative-50 p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">סה"כ הוצאות</p>
            <p className="text-lg font-bold text-negative-600">{fmt(totalExpenses)}</p>
          </div>
          <div className={cn("rounded-xl border p-4 text-center",
            taxableIncome >= 0 ? "border-info-100 bg-info-50" : "border-negative-100 bg-negative-50")}>
            <p className="text-xs text-gray-500 mb-1">הכנסה חייבת</p>
            <p className={cn("text-lg font-bold", taxableIncome >= 0 ? "text-info-700" : "text-negative-600")}>
              {fmt(taxableIncome)}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Income section */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-positive-50 px-5 py-3">
            <ArrowUpCircle className="h-4 w-4 text-positive-600" />
            <h4 className="text-sm font-semibold text-positive-800">הכנסות</h4>
            <span className="mr-auto text-xs font-medium text-positive-600">{fmt(totalIncome)}</span>
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
          <div className="flex items-center gap-2 border-b border-gray-100 bg-negative-50 px-5 py-3">
            <ArrowDownCircle className="h-4 w-4 text-negative-500" />
            <h4 className="text-sm font-semibold text-negative-800">הוצאות</h4>
            <span className="mr-auto text-xs font-medium text-negative-600">{fmt(totalExpenses)}</span>
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
