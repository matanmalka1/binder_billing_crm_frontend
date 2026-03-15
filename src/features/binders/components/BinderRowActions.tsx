import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "../../../utils/utils";
import { canMarkReady, canReturn } from "../utils";

interface BinderRowActionsProps {
  binderId: number;
  status: string;
  disabled?: boolean;
  onOpenDetail: () => void;
  onMarkReady: () => void;
  onReturn: () => void;
  onDelete: () => void;
}

export const BinderRowActions: React.FC<BinderRowActionsProps> = ({
  binderId,
  status,
  disabled = false,
  onOpenDetail,
  onMarkReady,
  onReturn,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const item = (label: string, onClick: () => void, danger = false, icon?: React.ReactNode) => (
    <button
      key={label}
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(false);
        onClick();
      }}
      className={cn(
        "w-full px-3 py-2 text-right text-sm transition-colors hover:bg-gray-50",
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700",
      )}
    >
      <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
        <span className="truncate">{label}</span>
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      </span>
    </button>
  );

  const hasActions = canMarkReady(status) || canReturn(status);

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
        aria-label={`פעולות לקלסר ${binderId}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {item("צפייה בפרטים", onOpenDetail, false, <Eye className="h-4 w-4" />)}
          {hasActions && <div className="my-1 border-t border-gray-100" />}
          {canMarkReady(status) && item("מוכן לאיסוף", onMarkReady, false, <CheckCircle2 className="h-4 w-4" />)}
          {canReturn(status) && item("החזרה", onReturn, false, <ArrowLeft className="h-4 w-4" />)}
          <div className="my-1 border-t border-gray-100" />
          {item("מחק קלסר", onDelete, true, <Trash2 className="h-4 w-4" />)}
        </div>
      )}
    </div>
  );
};

BinderRowActions.displayName = "BinderRowActions";
