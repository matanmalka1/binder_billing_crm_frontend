import { DataTable } from "../../../components/ui/DataTable";
import type { AdvancePaymentRow } from "../../../api/advancePayments.api";
import { buildAdvancePaymentColumns } from "./AdvancePaymentColumns";
import { CalendarDays } from "lucide-react";

interface AdvancePaymentTableProps {
  rows: AdvancePaymentRow[];
  isLoading: boolean;
}

export const AdvancePaymentTable: React.FC<AdvancePaymentTableProps> = ({ rows, isLoading }) => (
  <DataTable
    data={rows}
    columns={buildAdvancePaymentColumns()}
    getRowKey={(row) => row.id}
    isLoading={isLoading}
    emptyState={{
      icon: CalendarDays,
      title: "אין נתוני מקדמות",
      message: "בחר לקוח ושנה להצגת לוח מקדמות",
    }}
  />
);