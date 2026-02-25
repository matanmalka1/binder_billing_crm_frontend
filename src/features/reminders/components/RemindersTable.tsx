import { Calendar } from "lucide-react";
import { DataTable, type Column } from "../../../components/ui/DataTable";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { formatDate } from "../../../utils/utils";
import type { Reminder } from "../reminder.types";
import { reminderTypeLabels, statusLabels } from "../reminder.types";

interface RemindersTableProps {
  reminders: Reminder[];
  cancelingId: number | null;
  onCancel: (id: number) => void;
  onRowClick?: (reminder: Reminder) => void;
  showClient?: boolean;
}

const STATUS_VARIANTS: Record<string, "success" | "error" | "warning"> = {
  sent: "success",
  canceled: "error",
  pending: "warning",
};

export const RemindersTable: React.FC<RemindersTableProps> = ({
  reminders,
  cancelingId,
  onCancel,
  onRowClick,
  showClient = true,
}) => {
  const columns: Column<Reminder>[] = [
    {
      key: "type",
      header: "סוג",
      render: (r) => (
        <Badge variant="info">
          {reminderTypeLabels[r.reminder_type] ?? r.reminder_type}
        </Badge>
      ),
    },
    ...(showClient
      ? [
          {
            key: "client",
            header: "לקוח",
            render: (r: Reminder) => (
              <span className="font-mono text-sm text-gray-500">
                לקוח #{r.client_id}
              </span>
            ),
          },
        ]
      : []),
    {
      key: "message",
      header: "הודעה",
      render: (r) => (
        <p
          className="max-w-md truncate text-sm text-gray-700"
          title={r.message}
        >
          {r.message}
        </p>
      ),
    },
    {
      key: "target_date",
      header: "תאריך יעד",
      render: (r) => (
        <div>
          <div className="text-sm tabular-nums text-gray-700">
            {formatDate(r.target_date)}
          </div>
          <div className="text-xs text-gray-400">{r.days_before} ימים לפני</div>
        </div>
      ),
    },
    {
      key: "send_on",
      header: "שליחה ב",
      render: (r) => (
        <div className="flex items-center gap-1.5 text-sm tabular-nums text-gray-500">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          {formatDate(r.send_on)}
        </div>
      ),
    },
    {
      key: "status",
      header: "סטטוס",
      render: (r) => (
        <Badge variant={STATUS_VARIANTS[r.status] ?? "neutral"}>
          {statusLabels[r.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "פעולות",
      render: (r) =>
        r.status === "pending" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCancel(r.id);
            }}
            isLoading={cancelingId === r.id}
            disabled={cancelingId !== null}
            className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
          >
            ביטול
          </Button>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
  ];

  return (
    <DataTable
      data={reminders}
      columns={columns}
      getRowKey={(r) => r.id}
      onRowClick={onRowClick}
      emptyMessage="אין תזכורות להצגה"
    />
  );
};
