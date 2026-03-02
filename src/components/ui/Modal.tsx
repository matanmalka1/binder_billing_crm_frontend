import { useState } from "react";
import { Card } from "./Card";

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

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
        <div className="w-full max-w-lg">
          <Card>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                type="button"
                onClick={handleClose}
                className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                aria-label="סגירה"
              >
                ×
              </button>
            </div>
            <div className="py-4">{children}</div>
            <div className="border-t border-gray-100 pt-3">{footer}</div>
          </Card>
        </div>
      </div>

      {showGuard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm">
            <Card>
              <div className="pb-3">
                <h3 className="text-base font-semibold text-gray-900">לבטל שינויים?</h3>
              </div>
              <p className="py-3 text-sm text-gray-600">יש שינויים שלא נשמרו. האם לסגור בכל זאת?</p>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowGuard(false)}
                  className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  המשך עריכה
                </button>
                <button
                  type="button"
                  onClick={() => { setShowGuard(false); onClose(); }}
                  className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  סגור בלי לשמור
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
