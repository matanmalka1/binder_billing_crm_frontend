import { Card } from "../../../components/ui/primitives/Card";
import { Badge } from "../../../components/ui/primitives/Badge";
import { canAddInvoice } from "../utils";
import { isClientClosed } from "../../../utils/clientStatus";
import { useAddInvoice } from "../hooks/useVatInvoiceMutations";
import { VatInvoiceTable } from "./VatInvoiceTable";
import { VatInvoiceAddForm } from "./VatInvoiceAddForm";
import type { VatIncomeTabProps } from "../types";

export const VatIncomeTab: React.FC<VatIncomeTabProps> = ({ workItemId, status, invoices, clientStatus }) => {
  const canEdit = canAddInvoice(status) && !isClientClosed(clientStatus);
  const { addInvoice, isAdding } = useAddInvoice(workItemId);

  const incomeInvoices = invoices.filter((i) => i.invoice_type === "income");

  return (
    <div dir="rtl">
      <Card
        title='עסקאות (מע"מ עסקאות)'
        className="border-r-4 border-r-emerald-400"
        actions={
          <Badge variant="neutral" className="text-xs">
            {incomeInvoices.length} רשומות
          </Badge>
        }
      >
        <VatInvoiceTable
          invoices={incomeInvoices}
          canEdit={canEdit}
          workItemId={workItemId}
          sectionType="income"
          emptyMessage="עדיין לא הוספו חשבוניות עסקאות"
        />
        {canEdit && (
          <div className="mt-3">
            <VatInvoiceAddForm
              invoiceType="income"
              addInvoice={addInvoice}
              isAdding={isAdding}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

VatIncomeTab.displayName = "VatIncomeTab";
