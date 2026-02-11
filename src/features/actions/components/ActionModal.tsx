import React from "react";
import { Modal } from "../../../components/ui/Modal";

interface ActionModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

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
