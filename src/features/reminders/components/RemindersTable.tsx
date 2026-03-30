import { Calendar } from "lucide-react";
import { DataTable, type Column } from "../../../components/ui/table/DataTable";
import { Badge } from "../../../components/ui/primitives/Badge";
import { TruncateText } from "../../../components/ui/primitives/TruncateText";
import { formatDate } from "../../../utils/utils";
import type { Reminder } from "../types";
import { reminderTypeLabels, statusLabels } from "../types";
import { ReminderRowActions } from "./ReminderRowActions";

interface RemindersTableProps {
  reminders: Reminder[];
  cancelingId: number | null;
  markingSentId: number | null;
  onCancel: (id: number) => void;
  onMarkSent: (id: number) => void;
  onViewDetails: (reminder: Reminder) => void;
  onRowClick?: (reminder: Reminder) => void;
  showClient?: boolean;
}

const STATUS_VARIANTS: Record<string, "success" | "error" | "warning"> = {
  sent: "success",
  canceled: "error",
  pending: "warning",
  processing: "warning",
};

export const RemindersTable: React.FC<RemindersTableProps> = ({
  reminders,
  cancelingId,
  markingSentId,
  onCancel,
  onMarkSent,
  onViewDetails,
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
                עסק #{r.business_id}
              </span>
            ),
          },
        ]
      : []),
    {
      key: "message",
      header: "הודעה",
      render: (r) => <TruncateText text={r.message} maxWidth="max-w-md" className="text-gray-700" />,
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
      header: "",
      headerClassName: "w-10",
      className: "w-10",
      render: (r) => (
        <ReminderRowActions
          reminder={r}
          cancelingId={cancelingId}
          markingSentId={markingSentId}
          onCancel={onCancel}
          onMarkSent={onMarkSent}
          onViewDetails={onViewDetails}
        />
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
