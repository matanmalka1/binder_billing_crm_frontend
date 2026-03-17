import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { canAddInvoice } from "../utils";
import { useAddInvoice } from "../hooks/useVatInvoiceMutations";
import { VatInvoiceTable } from "./VatInvoiceTable";
import { VatInvoiceAddModal } from "./VatInvoiceAddModal";
import type { VatInvoiceResponse } from "../../../api/vatReports.api";

interface VatIncomeTabProps {
  workItemId: number;
  status: string;
  invoices: VatInvoiceResponse[];
}

export const VatIncomeTab: React.FC<VatIncomeTabProps> = ({ workItemId, status, invoices }) => {
  const canEdit = canAddInvoice(status);
  const { addInvoice, isAdding } = useAddInvoice(workItemId);
  const [showModal, setShowModal] = useState(false);

  const incomeInvoices = invoices.filter((i) => i.invoice_type === "income");

  return (
    <div dir="rtl">
      <Card
        title='עסקאות (מע"מ עסקאות)'
        className="border-r-4 border-r-emerald-400"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="neutral" className="text-xs">
              {incomeInvoices.length} רשומות
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
        <VatInvoiceTable
          invoices={incomeInvoices}
          canEdit={canEdit}
          workItemId={workItemId}
          sectionType="income"
        />
      </Card>

      <VatInvoiceAddModal
        open={showModal}
        invoiceType="income"
        addInvoice={addInvoice}
        isAdding={isAdding}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

VatIncomeTab.displayName = "VatIncomeTab";
