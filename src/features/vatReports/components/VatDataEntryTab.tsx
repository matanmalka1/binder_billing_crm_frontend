import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "../../../utils/utils";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { TableSkeleton } from "../../../components/ui/TableSkeleton";
import { formatVatAmount, canAddInvoice } from "../utils";
import { useAddInvoice } from "../hooks/useVatInvoiceMutations";
import { VatInvoiceTable } from "./VatInvoiceTable";
import { VatInvoiceAddForm } from "./VatInvoiceAddForm";
import type { VatInvoiceResponse } from "../../../api/vatReports.api";

interface VatDataEntryTabProps {
  workItemId: number;
  status: string;
  invoices: VatInvoiceResponse[];
  isLoading: boolean;
}

interface NetVatBannerProps {
  outputVat: number;
  inputVat: number;
}

const NetVatBanner: React.FC<NetVatBannerProps> = ({ outputVat, inputVat }) => {
  const net = outputVat - inputVat;
  const isPositive = net > 0;
  const isNegative = net < 0;

  const resultBg = isPositive ? "bg-emerald-50 border-emerald-200" : isNegative ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200";
  const resultText = isPositive ? "text-emerald-700" : isNegative ? "text-red-700" : "text-blue-700";
  const label = isPositive ? "לתשלום" : isNegative ? "לזיכוי" : "מאוזן";

  return (
    <div className="sticky top-[49px] z-10 flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-3 shadow-sm flex-wrap" dir="rtl">
      <div className="flex flex-col items-center gap-0.5 min-w-[120px] text-center">
        <span className="text-xs font-medium text-gray-500">מע"מ עסקאות</span>
        <span className="font-mono text-xl font-bold text-gray-800 tabular-nums">{formatVatAmount(outputVat)}</span>
      </div>

      <span className="text-2xl font-light text-gray-300 select-none">−</span>

      <div className="flex flex-col items-center gap-0.5 min-w-[120px] text-center">
        <span className="text-xs font-medium text-gray-500">מע"מ תשומות</span>
        <span className="font-mono text-xl font-bold text-gray-800 tabular-nums">{formatVatAmount(inputVat)}</span>
      </div>

      <span className="text-2xl font-light text-gray-300 select-none">=</span>

      <div className={cn("flex flex-col items-center gap-1 rounded-xl border px-5 py-2 min-w-[140px] text-center", resultBg)}>
        <span className="text-xs font-medium text-gray-500">מע"מ נטו</span>
        <span className={cn("font-mono text-2xl font-bold tabular-nums", resultText)}>{formatVatAmount(net)}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", resultText, "bg-white/60")}>{label}</span>
      </div>
    </div>
  );
};

interface AddRowToggleProps {
  onClick: () => void;
}

const AddRowToggle: React.FC<AddRowToggleProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/30"
  >
    <Plus className="h-4 w-4" />
    הוסף שורה
  </button>
);

export const VatDataEntryTab: React.FC<VatDataEntryTabProps> = ({
  workItemId,
  status,
  invoices,
  isLoading,
}) => {
  const canEdit = canAddInvoice(status);
  const { addInvoice: addIncomeInvoice, isAdding: isAddingIncome } = useAddInvoice(workItemId);
  const { addInvoice: addExpenseInvoice, isAdding: isAddingExpense } = useAddInvoice(workItemId);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const incomeInvoices = invoices.filter((i) => i.invoice_type === "income");
  const expenseInvoices = invoices.filter((i) => i.invoice_type === "expense");

  const outputVat = incomeInvoices.reduce((s, i) => s + Number(i.vat_amount), 0);
  const inputVat = expenseInvoices.reduce((s, i) => s + Number(i.vat_amount), 0);

  if (isLoading) {
    return <TableSkeleton rows={4} columns={6} />;
  }

  return (
    <div className="space-y-4" dir="rtl">
      <NetVatBanner outputVat={outputVat} inputVat={inputVat} />

      <Card
        title='עסקאות (מע"מ עסקאות)'
        className="border-r-4 border-r-emerald-400"
        actions={
          <Badge variant="neutral" className="text-xs">
            {incomeInvoices.length} רשומות
          </Badge>
        }
      >
        <div className="space-y-4">
          <VatInvoiceTable
            invoices={incomeInvoices}
            canEdit={canEdit}
            workItemId={workItemId}
            sectionType="income"
          />
          {canEdit && (
            showIncomeForm ? (
              <VatInvoiceAddForm
                invoiceType="income"
                addInvoice={addIncomeInvoice}
                isAdding={isAddingIncome}
                onCancel={() => setShowIncomeForm(false)}
              />
            ) : (
              <AddRowToggle onClick={() => setShowIncomeForm(true)} />
            )
          )}
        </div>
      </Card>

      <Card
        title='תשומות (מע"מ תשומות)'
        className="border-r-4 border-r-orange-400"
        actions={
          <Badge variant="neutral" className="text-xs">
            {expenseInvoices.length} רשומות
          </Badge>
        }
      >
        <div className="space-y-4">
          <VatInvoiceTable
            invoices={expenseInvoices}
            canEdit={canEdit}
            workItemId={workItemId}
            sectionType="expense"
          />
          {canEdit && (
            showExpenseForm ? (
              <VatInvoiceAddForm
                invoiceType="expense"
                addInvoice={addExpenseInvoice}
                isAdding={isAddingExpense}
                onCancel={() => setShowExpenseForm(false)}
              />
            ) : (
              <AddRowToggle onClick={() => setShowExpenseForm(true)} />
            )
          )}
        </div>
      </Card>
    </div>
  );
};

VatDataEntryTab.displayName = "VatDataEntryTab";
