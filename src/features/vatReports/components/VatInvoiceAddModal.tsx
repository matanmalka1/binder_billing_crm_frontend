import { Modal } from "../../../components/ui/Modal";
import { VatInvoiceAddForm } from "./VatInvoiceAddForm";
import type { useAddInvoice } from "../hooks/useVatInvoiceMutations";

interface VatInvoiceAddModalProps {
  open: boolean;
  invoiceType: "income" | "expense";
  addInvoice: ReturnType<typeof useAddInvoice>["addInvoice"];
  isAdding: boolean;
  onClose: () => void;
}

export const VatInvoiceAddModal: React.FC<VatInvoiceAddModalProps> = ({
  open,
  invoiceType,
  addInvoice,
  isAdding,
  onClose,
}) => {
  const title = invoiceType === "income" ? "הוספת חשבונית עסקאות" : "הוספת חשבונית תשומות";

  return (
    <Modal open={open} title={title} footer={null} onClose={onClose}>
      <VatInvoiceAddForm
        invoiceType={invoiceType}
        addInvoice={addInvoice}
        isAdding={isAdding}
        onCancel={onClose}
      />
    </Modal>
  );
};

VatInvoiceAddModal.displayName = "VatInvoiceAddModal";
