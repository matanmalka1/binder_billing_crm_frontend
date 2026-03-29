import { Modal } from "../../../components/ui/overlays/Modal";
import { VatInvoiceAddForm } from "./VatInvoiceAddForm";
import type { VatInvoiceAddModalProps } from "../types";

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
