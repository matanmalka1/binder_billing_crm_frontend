import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, CheckCircle2, Edit2, Trash2 } from "lucide-react";
import { cn } from "../../../utils/utils";
import type { TaxDeadlineResponse } from "../../../api/taxDeadlines.api";

interface TaxDeadlineRowActionsProps {
  deadline: TaxDeadlineResponse;
  completingId: number | null;
  deletingId?: number | null;
  onComplete: (id: number) => void;
  onEdit?: (deadline: TaxDeadlineResponse) => void;
  onDelete?: (id: number) => void;
}

export const TaxDeadlineRowActions: React.FC<TaxDeadlineRowActionsProps> = ({
  deadline,
  completingId,
  deletingId,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isCompleted = deadline.status === "completed";

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const item = (label: string, onClick: () => void, icon: React.ReactNode, danger = false, disabled = false) => (
    <button
      key={label}
      type="button"
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); setOpen(false); onClick(); }}
      className={cn(
        "w-full px-3 py-2 text-right text-sm transition-colors hover:bg-gray-50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700",
      )}
    >
      <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
        <span className="truncate">{label}</span>
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      </span>
    </button>
  );

  const hasMenu = !isCompleted || onEdit || onDelete;
  if (!hasMenu) return null;

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
        aria-label={`פעולות למועד ${deadline.id}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {!isCompleted && item(
            "סמן הושלם",
            () => onComplete(deadline.id),
            <CheckCircle2 className="h-4 w-4 text-green-600" />,
            false,
            completingId !== null,
          )}
          {onEdit && item("עריכה", () => onEdit(deadline), <Edit2 className="h-4 w-4" />)}
          {onDelete && (
            <>
              {(!isCompleted || onEdit) && <div className="my-1 border-t border-gray-100" />}
              {item(
                "מחק",
                () => onDelete(deadline.id),
                <Trash2 className="h-4 w-4" />,
                true,
                deletingId === deadline.id,
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

TaxDeadlineRowActions.displayName = "TaxDeadlineRowActions";
