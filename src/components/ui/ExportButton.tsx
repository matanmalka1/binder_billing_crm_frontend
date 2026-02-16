import { useState } from "react";
import { FileDown, FileSpreadsheet, ChevronDown } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../utils/utils";

export type ExportFormat = "excel" | "pdf";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    setIsOpen(false);
    try {
      await onExport(format);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || exporting !== null}
        isLoading={exporting !== null}
        className="gap-2"
      >
        <FileDown className="h-4 w-4" />
        ייצוא
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
            <button
              type="button"
              onClick={() => handleExport("excel")}
              disabled={exporting !== null}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors",
                "hover:bg-green-50 disabled:opacity-50",
                exporting === "excel" && "bg-green-50"
              )}
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <span className="font-medium text-gray-700">Excel</span>
            </button>
            <div className="border-t border-gray-100" />
            <button
              type="button"
              onClick={() => handleExport("pdf")}
              disabled={exporting !== null}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors",
                "hover:bg-red-50 disabled:opacity-50",
                exporting === "pdf" && "bg-red-50"
              )}
            >
              <FileDown className="h-4 w-4 text-red-600" />
              <span className="font-medium text-gray-700">PDF</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
