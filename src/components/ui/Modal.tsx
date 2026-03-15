import { useState } from "react";
import { OverlayContainer } from "./OverlayContainer";
import { UnsavedChangesGuard } from "./UnsavedChangesGuard";

interface ModalProps {
  open: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  onClose: () => void;
  /** When true, closing shows a confirmation prompt before discarding */
  isDirty?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  footer,
  onClose,
  isDirty = false,
}) => {
  const [showGuard, setShowGuard] = useState(false);

  const handleClose = () => {
    if (isDirty) {
      setShowGuard(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <OverlayContainer
        open={open}
        variant="modal"
        title={title}
        footer={footer}
        onClose={handleClose}
      >
        {children}
      </OverlayContainer>

      {showGuard && (
        <UnsavedChangesGuard
          onContinue={() => setShowGuard(false)}
          onDiscard={() => { setShowGuard(false); onClose(); }}
        />
      )}
    </>
  );
};

Modal.displayName = "Modal";
