import { DataTable } from "../../../components/ui/DataTable";
import type { AdvancePaymentRow, AdvancePaymentStatus } from "../../../api/advancePayments.api";
import { buildAdvancePaymentColumns } from "./AdvancePaymentColumns";
import { CalendarDays } from "lucide-react";

interface AdvancePaymentTableProps {
  rows: AdvancePaymentRow[];
  isLoading: boolean;
  canEdit?: boolean;
  updatingId?: number | null;
  onUpdate?: (id: number, paid_amount: number | null, status: AdvancePaymentStatus, expected_amount: number | null) => void;
}

export const AdvancePaymentTable: React.FC<AdvancePaymentTableProps> = ({
  rows,
  isLoading,
  canEdit = false,
  updatingId = null,
  onUpdate,
}) => (
  <DataTable
    data={rows}
    columns={buildAdvancePaymentColumns(
      canEdit && onUpdate
        ? { canEdit: true, updatingId, onUpdate }
        : undefined,
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