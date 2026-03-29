import { useEffect } from "react";

interface UseEscapeToCloseOptions {
  open: boolean;
  onClose?: () => void;
}

export const useEscapeToClose = ({ open, onClose }: UseEscapeToCloseOptions) => {
  useEffect(() => {
    if (!open || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);
};
