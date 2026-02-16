import { Calendar} from "lucide-react";
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
}

const buildRemindersColumns = (
  cancelingId: number | null,
  onCancel: (id: number) => void,
): Column<Reminder>[] => [
  {
    key: "type",
    header: "סוג",
    render: (reminder) => (
      <Badge variant="info">
        {reminderTypeLabels[reminder.reminder_type] || reminder.reminder_type}
      </Badge>
    ),
  },
  {
    key: "client",
    header: "לקוח",
    render: (reminder) => (
      <span className="font-mono text-sm">לקוח #{reminder.client_id}</span>
    ),
  },
  {
    key: "message",
    header: "הודעה",
    render: (reminder) => (
      <div className="max-w-md">
        <p className="text-sm text-gray-700 truncate" title={reminder.message}>
          {reminder.message}
        </p>
      </div>
    ),
  },
  {
    key: "target_date",
    header: "תאריך יעד",
    render: (reminder) => (
      <div className="text-sm">
        <div className="text-gray-700">{formatDate(reminder.target_date)}</div>
        <div className="text-xs text-gray-500">
          {reminder.days_before} ימים לפני
        </div>
      </div>
    ),
  },
  {
    key: "send_on",
    header: "שליחה ב",
    render: (reminder) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-700">
          {formatDate(reminder.send_on)}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "סטטוס",
    render: (reminder) => (
      <Badge
        variant={
          reminder.status === "SENT"
            ? "success"
            : reminder.status === "CANCELED"
            ? "error"
            : "warning"
        }
      >
        {statusLabels[reminder.status]}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "פעולות",
    render: (reminder) =>
      reminder.status === "PENDING" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCancel(reminder.id)}
          isLoading={cancelingId === reminder.id}
          disabled={cancelingId !== null}
        >
          ביטול
        </Button>
      ) : (
        <span className="text-gray-500 text-sm">—</span>
      ),
  },
];

export const RemindersTable: React.FC<RemindersTableProps> = ({
  reminders,
  cancelingId,
  onCancel,
}) => {
  const columns = buildRemindersColumns(cancelingId, onCancel);

  return (
    <DataTable
      data={reminders}
      columns={columns}
      getRowKey={(reminder) => reminder.id}
      emptyMessage="אין תזכורות להצגה"
    />
  );
};
