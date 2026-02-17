import { DataTable } from "../../../components/ui/DataTable";
import type { AdvancePaymentRow } from "../../../api/advancePayments.api";
import { buildAdvancePaymentColumns } from "./AdvancePaymentColumns";
import { CalendarDays } from "lucide-react";

interface Props {
  rows: AdvancePaymentRow[];
  isLoading: boolean;
}

export const AdvancePaymentTable: React.FC<Props> = ({ rows, isLoading }) => {
  const columns = buildAdvancePaymentColumns();

  return (
    <DataTable
      data={rows}
      columns={columns}
      getRowKey={(row) => row.id}
      isLoading={isLoading}
      emptyState={{
        icon: CalendarDays,
        title: "אין נתוני מקדמות",
        message: "בחר לקוח ושנה להצגת לוח מקדמות",
      }}
    />
  );
};
