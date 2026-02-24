import { X } from "lucide-react";
import { ExportCard } from "./ExportCard";
import { ImportCard } from "./ImportCard";
import { ImportExportInstructions } from "./ImportExportInstructions";
import { useImportExport } from "../hooks/useImportExport";

interface ImportExportModalProps {
  open: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ open, onClose }) => {
  const {
    importing,
    exporting,
    entityLabel,
    handleExport,
    handleImport,
    handleDownloadTemplate,
  } = useImportExport();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">
            ייבוא וייצוא {entityLabel}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-6">
          <ExportCard
            entityLabel={entityLabel}
            exporting={exporting}
            onExport={handleExport}
          />
          <ImportCard
            entityLabel={entityLabel}
            importing={importing}
            onFileSelect={handleImport}
            onDownloadTemplate={handleDownloadTemplate}
          />
          <ImportExportInstructions />
        </div>
      </div>
    </div>
  );
};
