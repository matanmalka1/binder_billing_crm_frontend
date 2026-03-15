import { useEffect, useRef, useState } from "react";
import { Eye, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "../../../utils/utils";
import { canCancel, canIssue, canMarkPaid } from "../utils";

interface ChargeRowActionsProps {
  chargeId: number;
  status: string;
  disabled?: boolean;
  showActions?: boolean;
  onIssue: () => void;
  onMarkPaid: () => void;
  onCancel: () => void;
  onOpenDetail: () => void;
}

export const ChargeRowActions: React.FC<ChargeRowActionsProps> = ({
  chargeId,
  status,
  disabled = false,
  showActions = true,
  onIssue,
  onMarkPaid,
  onCancel,
  onOpenDetail,
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

  const hasActions = showActions && (canIssue(status) || canMarkPaid(status) || canCancel(status));

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

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
        aria-label={`פעולות לחיוב ${chargeId}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {item("צפייה בפרטים", onOpenDetail, false, <Eye className="h-4 w-4" />)}
          {hasActions && <div className="my-1 border-t border-gray-100" />}
          {showActions && canIssue(status) && item("הנפקה", onIssue, false, <FileText className="h-4 w-4" />)}
          {showActions && canMarkPaid(status) && item("סימון שולם", onMarkPaid)}
          {showActions && canCancel(status) && item("ביטול", onCancel, true, <Trash2 className="h-4 w-4" />)}
        </div>
      )}
    </div>
  );
};

ChargeRowActions.displayName = "ChargeRowActions";
