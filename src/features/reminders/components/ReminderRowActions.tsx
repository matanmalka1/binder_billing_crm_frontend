import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { cn } from "../../../utils/utils";
import type { Reminder } from "../types";

interface ReminderRowActionsProps {
  reminder: Reminder;
  cancelingId: number | null;
  onCancel: (id: number) => void;
}

export const ReminderRowActions: React.FC<ReminderRowActionsProps> = ({
  reminder,
  cancelingId,
  onCancel,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isPending = reminder.status === "pending";

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!isPending) return <span className="text-sm text-gray-400">—</span>;

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
        aria-label={`פעולות לתזכורת ${reminder.id}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            disabled={cancelingId !== null}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onCancel(reminder.id);
            }}
            className={cn(
              "w-full px-3 py-2 text-right text-sm text-red-600 transition-colors hover:bg-red-50",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
              <span className="truncate">ביטול</span>
              <span className="flex h-4 w-4 items-center justify-center">
                <X className="h-4 w-4" />
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

ReminderRowActions.displayName = "ReminderRowActions";
