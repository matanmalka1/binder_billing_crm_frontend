import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../../utils/utils";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../types";
import { EditAdvancePaymentInline } from "./EditAdvancePaymentInline";

interface AdvancePaymentRowActionsProps {
  row: AdvancePaymentRow;
  updatingId: number | null;
  deletingId: number | null;
  onUpdate: (id: number, paid_amount: number | null, status: AdvancePaymentStatus, expected_amount: number | null) => void;
  onDelete: (id: number) => void;
}

export const AdvancePaymentRowActions: React.FC<AdvancePaymentRowActionsProps> = ({
  row,
  updatingId,
  deletingId,
  onUpdate,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setEditing(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      {editing ? (
        <EditAdvancePaymentInline
          row={row}
          isUpdating={updatingId === row.id}
          onSave={(paid_amount, status, expected_amount) => {
            onUpdate(row.id, paid_amount, status, expected_amount);
            setEditing(false);
            setOpen(false);
          }}
          onCancel={() => { setEditing(false); setOpen(false); }}
        />
      ) : (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
          aria-label={`פעולות למקדמה ${row.id}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}

      {open && !editing && (
        <div className="absolute left-0 top-8 z-50 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            className="w-full px-3 py-2 text-right text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
              <span className="truncate">עריכה</span>
              <span className="flex h-4 w-4 items-center justify-center">
                <Pencil className="h-4 w-4" />
              </span>
            </span>
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            disabled={deletingId === row.id}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              if (window.confirm("האם למחוק את המקדמה?")) onDelete(row.id);
            }}
            className={cn(
              "w-full px-3 py-2 text-right text-sm text-red-600 transition-colors hover:bg-red-50",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
              <span className="truncate">{deletingId === row.id ? "מוחק..." : "מחק"}</span>
              <span className="flex h-4 w-4 items-center justify-center">
                <Trash2 className="h-4 w-4" />
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

AdvancePaymentRowActions.displayName = "AdvancePaymentRowActions";
