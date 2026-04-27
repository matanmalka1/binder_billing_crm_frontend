import { DataTable } from "../../../components/ui/table/DataTable";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../types";
import { buildAdvancePaymentColumns } from "./AdvancePaymentColumns";
import { CalendarDays } from "lucide-react";

interface AdvancePaymentTableProps {
  rows: AdvancePaymentRow[];
  isLoading: boolean;
  showBusinessName?: boolean;
  canEdit?: boolean;
  updatingId?: number | null;
  deletingId?: number | null;
  onUpdate?: (
    id: number,
    paid_amount: string | null,
    status: AdvancePaymentStatus,
    expected_amount: string | null,
  ) => void;
  onDelete?: (id: number) => void;
}

export const AdvancePaymentTable: React.FC<AdvancePaymentTableProps> = ({
  rows,
  isLoading,
  showBusinessName = false,
  canEdit = false,
  updatingId = null,
  deletingId = null,
  onUpdate,
  onDelete,
}) => (
  <DataTable
    data={rows}
    columns={buildAdvancePaymentColumns(
      canEdit && onUpdate && onDelete
        ? { canEdit: true, showBusinessName, updatingId, deletingId, onUpdate, onDelete }
        : { canEdit: false, showBusinessName },
    )}
    getRowKey={(row) => row.id}
    isLoading={isLoading}
    emptyState={{
      icon: CalendarDays,
      title: "אין מקדמות לשנה זו",
      message: "לא נמצאו רשומות מקדמות לשנה הנבחרת",
    }}
  />
);
