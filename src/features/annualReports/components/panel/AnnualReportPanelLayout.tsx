import { Download } from "lucide-react";
import { UnsavedChangesGuard } from "@/components/ui/feedback/UnsavedChangesGuard";
import { useEscapeToClose } from "@/components/ui/overlays/useEscapeToClose";
import { useUnsavedChangesGuard } from "@/components/ui/overlays/useUnsavedChangesGuard";

interface AnnualReportPanelLayoutProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onDelete: () => void;
  onSave: () => void;
  isDirty: boolean;
  isSaving: boolean;
  children: React.ReactNode;
  onExportPdf?: () => void;
  isExportingPdf?: boolean;
}

export const AnnualReportPanelLayout = ({
  open,
  title,
  subtitle,
  onClose,
  onDelete,
  onSave,
  isDirty,
  isSaving,
  children,
  onExportPdf,
  isExportingPdf = false,
}: AnnualReportPanelLayoutProps) => {
  const { showGuard, handleClose, handleContinue, handleDiscard } = useUnsavedChangesGuard({
    isDirty,
    onClose,
  });

  useEscapeToClose({ open, onClose: handleClose });

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[95vw] h-[95vh] max-w-7xl bg-white rounded-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4"
            dir="rtl"
          >
            <div>
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onExportPdf && (
                <button
                  type="button"
                  onClick={onExportPdf}
                  disabled={isExportingPdf}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={14} />
                  {isExportingPdf ? "מפיק..." : "הורד טיוטה"}
                </button>
              )}
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                מחק דוח
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={!isDirty || isSaving}
                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? "שומר..." : "שמור"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="סגירה"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">{children}</div>
        </div>
      </div>

      {/* Unsaved changes guard */}
      {showGuard && (
        <UnsavedChangesGuard onContinue={handleContinue} onDiscard={handleDiscard} />
      )}
    </>
  );
};

AnnualReportPanelLayout.displayName = "AnnualReportPanelLayout";
