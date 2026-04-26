import { X, CheckCheck, Eye } from "lucide-react";
import { RowActionItem, RowActionsMenu } from "@/components/ui/table";
import type { Reminder } from "../types";

interface ReminderRowActionsProps {
  reminder: Reminder;
  cancelingId: number | null;
  markingSentId: number | null;
  onCancel: (id: number) => void;
  onMarkSent: (id: number) => void;
  onViewDetails: (reminder: Reminder) => void;
}

export const ReminderRowActions: React.FC<ReminderRowActionsProps> = ({
  reminder,
  cancelingId,
  markingSentId,
  onCancel,
  onMarkSent,
  onViewDetails,
}) => {
  const isPending = reminder.status === "pending";
  const isBusy = cancelingId !== null || markingSentId !== null;

  return (
    <RowActionsMenu ariaLabel={`פעולות לתזכורת ${reminder.id}`}>
        <RowActionItem label="פרטים" onClick={() => onViewDetails(reminder)} icon={<Eye className="h-4 w-4" />} />
        {isPending && (
          <>
            <RowActionItem
              label="סמן כנשלח"
              onClick={() => onMarkSent(reminder.id)}
              icon={<CheckCheck className="h-4 w-4" />}
              disabled={isBusy}
            />
            <RowActionItem
              label="ביטול"
              onClick={() => onCancel(reminder.id)}
              icon={<X className="h-4 w-4" />}
              danger
              disabled={isBusy}
            />
          </>
        )}
      </RowActionsMenu>
  );
};

ReminderRowActions.displayName = "ReminderRowActions";
