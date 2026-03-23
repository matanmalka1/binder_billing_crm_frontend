import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/DropdownMenu";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../types";
import { EditAdvancePaymentInline } from "./EditAdvancePaymentInline";

interface AdvancePaymentRowActionsProps {
  row: AdvancePaymentRow;
  updatingId: number | null;
  deletingId: number | null;
  onUpdate: (id: number, paid_amount: string | null, status: AdvancePaymentStatus, expected_amount: string | null) => void;
  onDelete: (id: number) => void;
}

export const AdvancePaymentRowActions: React.FC<AdvancePaymentRowActionsProps> = ({
  row,
  updatingId,
  deletingId,
  onUpdate,
  onDelete,
}) => {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setEditing(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [editing]);

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      {editing ? (
        <EditAdvancePaymentInline
          row={row}
          isUpdating={updatingId === row.id}
          onSave={(paid_amount, status, expected_amount) => {
            onUpdate(row.id, paid_amount, status, expected_amount);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <DropdownMenu ariaLabel={`פעולות למקדמה ${row.id}`}>
          <DropdownMenuItem
            label="עריכה"
            onClick={() => setEditing(true)}
            icon={<Pencil className="h-4 w-4" />}
          />
          <div className="my-1 border-t border-gray-100" />
          <DropdownMenuItem
            label={deletingId === row.id ? "מוחק..." : "מחק"}
            onClick={() => setConfirmDelete(true)}
            icon={<Trash2 className="h-4 w-4" />}
            danger
            disabled={deletingId === row.id}
          />
        </DropdownMenu>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="מחיקת מקדמה"
        message="האם למחוק את המקדמה? פעולה זו אינה הפיכה."
        confirmLabel="מחק"
        cancelLabel="ביטול"
        isLoading={deletingId === row.id}
        onConfirm={() => { setConfirmDelete(false); onDelete(row.id); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

AdvancePaymentRowActions.displayName = "AdvancePaymentRowActions";
