import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Download, History, CheckCircle, XCircle, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "../../../utils/utils";
import type { PermanentDocumentResponse } from "../../../api/documents.api";

interface DocumentRowActionsProps {
  doc: PermanentDocumentResponse;
  isAdvisor: boolean;
  canPerformActions: boolean;
  downloadingId: number | null;
  replacingId: number | null;
  deletingId: number | null;
  rejectingId: number | null;
  onDownload: (id: number) => void;
  onReplace: (id: number) => void;
  onDelete: (id: number) => void;
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
  handleExpandVersions: (id: number) => void;
}

export const DocumentRowActions: React.FC<DocumentRowActionsProps> = ({
  doc,
  isAdvisor,
  canPerformActions,
  downloadingId,
  replacingId,
  deletingId,
  rejectingId,
  onDownload,
  onReplace,
  onDelete,
  handleApprove,
  handleReject,
  handleExpandVersions,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const item = (
    label: string,
    onClick: () => void,
    icon: React.ReactNode,
    danger = false,
    disabled = false,
  ) => (
    <button
      key={label}
      type="button"
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); setOpen(false); onClick(); }}
      className={cn(
        "w-full px-3 py-2 text-right text-sm transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed",
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700",
      )}
    >
      <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
        <span className="truncate">{label}</span>
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      </span>
    </button>
  );

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
        aria-label={`פעולות למסמך ${doc.id}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {item(
            downloadingId === doc.id ? "מוריד..." : "הורד",
            () => onDownload(doc.id),
            <Download className="h-4 w-4" />,
            false,
            downloadingId === doc.id,
          )}
          {item("היסטוריית גרסאות", () => handleExpandVersions(doc.id), <History className="h-4 w-4" />)}

          {canPerformActions && (
            <>
              <div className="my-1 border-t border-gray-100" />
              {item("אשר", () => handleApprove(doc.id), <CheckCircle className="h-4 w-4 text-green-600" />)}
              {item("דחה", () => handleReject(doc.id), <XCircle className="h-4 w-4 text-red-500" />, true, rejectingId === doc.id)}
            </>
          )}

          {isAdvisor && (
            <>
              <div className="my-1 border-t border-gray-100" />
              {item(
                replacingId === doc.id ? "מחליף..." : "החלף",
                () => onReplace(doc.id),
                <RefreshCw className="h-4 w-4" />,
                false,
                replacingId === doc.id,
              )}
              {item(
                deletingId === doc.id ? "מוחק..." : "מחק",
                () => onDelete(doc.id),
                <Trash2 className="h-4 w-4" />,
                true,
                deletingId === doc.id,
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

DocumentRowActions.displayName = "DocumentRowActions";
