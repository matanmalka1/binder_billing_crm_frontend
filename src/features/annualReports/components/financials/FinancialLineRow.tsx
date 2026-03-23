import { Paperclip, Pencil, Trash2 } from "lucide-react";
import { documentsApi } from "@/features/documents/api";

export interface LineRowProps {
  label: string;
  amount: string | number;
  description?: string | null;
  recognitionRate?: string | number | null;
  supportingDocumentRef?: string | null;
  supportingDocumentId?: number | null;
  supportingDocumentFilename?: string | null;
  onEdit?: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const LineRow: React.FC<LineRowProps> = ({
  label, amount, description, recognitionRate,
  supportingDocumentRef, supportingDocumentId, supportingDocumentFilename,
  onEdit,
  onDelete, isDeleting,
}) => {
  const handleDownload = async () => {
    if (!supportingDocumentId) return;
    const { url } = await documentsApi.getDownloadUrl(supportingDocumentId);
    window.open(url, "_blank");
  };

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 text-sm">
      <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
        <span className="font-medium text-gray-800">{label}</span>
        {description && <span className="text-gray-500 mr-1">— {description}</span>}
        {recognitionRate != null && Number(recognitionRate) < 100 && (
          <span className="inline-flex items-center rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800">
            {Number(recognitionRate)}%
          </span>
        )}
        {supportingDocumentId ? (
          <button type="button" onClick={handleDownload}
            className="text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
            title={supportingDocumentFilename ?? "מסמך מצורף"}>
            <Paperclip className="h-3 w-3" />
            <span className="text-xs">{supportingDocumentFilename ?? "מסמך"}</span>
          </button>
        ) : supportingDocumentRef ? (
          <span className="flex items-center gap-0.5 text-xs text-gray-500" title={supportingDocumentRef}>
            <Paperclip className="h-3 w-3" />{supportingDocumentRef}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2 mr-2">
        <span className="text-gray-700 font-mono">₪{Number(amount).toLocaleString("he-IL")}</span>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="text-blue-400 hover:text-blue-600 p-0.5"
            aria-label="עריכת שורה"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        ) : null}
        <button type="button" onClick={onDelete} disabled={isDeleting}
          className="text-red-400 hover:text-red-600 disabled:opacity-40 p-0.5" aria-label="מחק">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

LineRow.displayName = "LineRow";
