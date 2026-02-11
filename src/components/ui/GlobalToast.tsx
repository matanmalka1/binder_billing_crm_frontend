import React, { useEffect } from "react";
import { useUIStore } from "../../store/ui.store";
import { cn } from "../../utils/cn";

export const GlobalToast: React.FC = () => {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      hideToast();
    }, 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast, hideToast]);

  if (!toast) {
    return null;
  }

  const toneClass =
    toast.tone === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4" dir="rtl">
      <div className={cn("w-full max-w-md rounded-md border px-4 py-3 shadow-sm", toneClass)}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            type="button"
            className="rounded px-2 py-1 text-xs font-medium"
            onClick={hideToast}
            aria-label="סגירת הודעה"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
