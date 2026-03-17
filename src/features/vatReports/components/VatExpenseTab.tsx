import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { canAddInvoice } from "../utils";
import { useAddInvoice } from "../hooks/useVatInvoiceMutations";
import { EXPENSE_CATEGORIES, CATEGORY_LABELS } from "../constants";
import { VatInvoiceTable } from "./VatInvoiceTable";
import { VatInvoiceAddModal } from "./VatInvoiceAddModal";
import type { VatInvoiceResponse } from "../../../api/vatReports.api";

interface VatExpenseTabProps {
  workItemId: number;
  status: string;
  invoices: VatInvoiceResponse[];
}

const CATEGORY_FILTER_OPTIONS = [
  { value: "", label: "כל הקטגוריות" },
  ...EXPENSE_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] ?? c })),
];

export const VatExpenseTab: React.FC<VatExpenseTabProps> = ({ workItemId, status, invoices }) => {
  const canEdit = canAddInvoice(status);
  const { addInvoice, isAdding } = useAddInvoice(workItemId);
  const [showModal, setShowModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const expenseInvoices = invoices.filter((i) => i.invoice_type === "expense");
  const filtered = categoryFilter
    ? expenseInvoices.filter((i) => i.expense_category === categoryFilter)
    : expenseInvoices;

  return (
    <div dir="rtl">
      <Card
        title='תשומות (מע"מ תשומות)'
        className="border-r-4 border-r-orange-400"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="neutral" className="text-xs">
              {expenseInvoices.length} רשומות
            </Badge>
            {canEdit && (
              <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
                <Plus className="h-3.5 w-3.5" />
                הוסף חשבונית
              </Button>
            )}
          </div>
        }
      >
        <div className="mb-3 w-52">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={CATEGORY_FILTER_OPTIONS}
          />
        </div>
        <VatInvoiceTable
          invoices={filtered}
          canEdit={canEdit}
          workItemId={workItemId}
          sectionType="expense"
        />
      </Card>

      <VatInvoiceAddModal
        open={showModal}
        invoiceType="expense"
        addInvoice={addInvoice}
        isAdding={isAdding}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

VatExpenseTab.displayName = "VatExpenseTab";
