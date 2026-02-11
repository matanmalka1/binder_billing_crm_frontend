import React from "react";
import { Card } from "./Card";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  footer,
  onClose,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg">
        <Card>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              aria-label="סגירה"
            >
              ×
            </button>
          </div>
          <div className="py-4">{children}</div>
          {footer ? <div className="border-t border-gray-100 pt-3">{footer}</div> : null}
        </Card>
      </div>
    </div>
  );
};
