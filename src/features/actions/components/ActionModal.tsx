import { Modal } from "../../../components/ui/Modal";
import type { ActionModalProps } from "../types";

export const ActionModal: React.FC<ActionModalProps> = ({
  open,
  title,
  onClose,
  children,
  footer,
}) => {
  return (
    <Modal open={open} title={title} onClose={onClose} footer={footer}>
      {children}
    </Modal>
  );
};
