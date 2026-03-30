import { useState } from "react";
import { Card } from "../../../components/ui/primitives/Card";
import { Badge } from "../../../components/ui/primitives/Badge";
import { SelectDropdown } from "../../../components/ui/inputs/SelectDropdown";
import { canAddInvoice } from "../utils";
import { isClientClosed } from "../../../utils/clientStatus";
import { useAddInvoice } from "../hooks/useVatInvoiceMutations";
import { VAT_EXPENSE_CATEGORY_FILTER_OPTIONS } from "../constants";
import { VatInvoiceTable } from "./VatInvoiceTable";
import { VatInvoiceAddForm } from "./VatInvoiceAddForm";
import type { VatExpenseTabProps } from "../types";

export const VatExpenseTab: React.FC<VatExpenseTabProps> = ({ workItemId, status, invoices, clientStatus, isFilingPending }) => {
  const canEdit = canAddInvoice(status) && !isClientClosed(clientStatus) && !isFilingPending;
  const { addInvoice, isAdding } = useAddInvoice(workItemId);
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
          <Badge variant="neutral" className="text-xs">
            {expenseInvoices.length} רשומות
          </Badge>
        }
      >
        <div className="mb-3 w-52">
          <SelectDropdown
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={VAT_EXPENSE_CATEGORY_FILTER_OPTIONS}
          />
        </div>
        <VatInvoiceTable
          invoices={filtered}
          canEdit={canEdit}
          workItemId={workItemId}
          sectionType="expense"
          emptyMessage="עדיין לא הוספו חשבוניות תשומות"
        />
        {canEdit && (
          <div className="mt-3">
            <VatInvoiceAddForm
              invoiceType="expense"
              addInvoice={addInvoice}
              isAdding={isAdding}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

VatExpenseTab.displayName = "VatExpenseTab";
