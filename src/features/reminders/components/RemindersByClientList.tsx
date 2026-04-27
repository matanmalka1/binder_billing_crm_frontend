import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { formatClientOfficeId } from "@/utils/utils";
import type { Reminder } from "../types";
import { RemindersTable } from "./RemindersTable";

type ReminderClientGroup = {
  key: string;
  clientRecordId: number | null;
  clientName: string;
  officeClientNumber: number | null;
  clientIdNumber: string | null;
  reminders: Reminder[];
};

interface RemindersByClientListProps {
  reminders: Reminder[];
  cancelingId: number | null;
  markingSentId: number | null;
  onCancel: (id: number) => void;
  onMarkSent: (id: number) => void;
  onViewDetails: (reminder: Reminder) => void;
  onRowClick?: (reminder: Reminder) => void;
}

const buildReminderClientKey = (reminder: Reminder) => {
  if (reminder.client_record_id != null) return `client:${reminder.client_record_id}`;
  if (reminder.office_client_number != null) return `office:${reminder.office_client_number}`;
  if (reminder.client_id_number) return `id:${reminder.client_id_number}`;
  return `unknown:${reminder.client_name ?? "no-client"}`;
};

const groupRemindersByClient = (reminders: Reminder[]) => {
  const groups = new Map<string, ReminderClientGroup>();

  reminders.forEach((reminder) => {
    const key = buildReminderClientKey(reminder);
    const current = groups.get(key);

    if (current) {
      current.reminders.push(reminder);
      return;
    }

    groups.set(key, {
      key,
      clientRecordId: reminder.client_record_id,
      clientName: reminder.client_name ?? "ללא שם לקוח",
      officeClientNumber: reminder.office_client_number,
      clientIdNumber: reminder.client_id_number,
      reminders: [reminder],
    });
  });

  return Array.from(groups.values());
};

export const RemindersByClientList: React.FC<RemindersByClientListProps> = ({
  reminders,
  cancelingId,
  markingSentId,
  onCancel,
  onMarkSent,
  onViewDetails,
  onRowClick,
}) => {
  const groups = useMemo(() => groupRemindersByClient(reminders), [reminders]);
  const [collapsedKeys, setCollapsedKeys] = useState<Set<string>>(new Set());

  const toggleCollapsed = (key: string) => {
    setCollapsedKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const collapsed = collapsedKeys.has(group.key);
        const Icon = collapsed ? ChevronLeft : ChevronDown;

        return (
          <section
            key={group.key}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="min-w-0">
                {group.clientRecordId != null ? (
                  <Link
                    to={`/clients/${group.clientRecordId}`}
                    className="block truncate text-sm font-semibold text-gray-800 hover:underline"
                  >
                    {group.clientName}
                  </Link>
                ) : (
                  <h2 className="truncate text-sm font-semibold text-gray-800">
                    {group.clientName}
                  </h2>
                )}
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span>{group.reminders.length} תזכורות</span>
                  {group.officeClientNumber != null && (
                    <span>מס' לקוח: {formatClientOfficeId(group.officeClientNumber)}</span>
                  )}
                  {group.clientIdNumber && <span>ת.ז / ח.פ: {group.clientIdNumber}</span>}
                </div>
              </div>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                onClick={() => toggleCollapsed(group.key)}
                aria-expanded={!collapsed}
                aria-label={collapsed ? "פתח תזכורות לקוח" : "קפל תזכורות לקוח"}
              >
                <Icon className="h-4 w-4" />
              </button>
            </header>
            {!collapsed && (
              <RemindersTable
                reminders={group.reminders}
                cancelingId={cancelingId}
                markingSentId={markingSentId}
                onCancel={onCancel}
                onMarkSent={onMarkSent}
                onViewDetails={onViewDetails}
                onRowClick={onRowClick}
                showClient={false}
              />
            )}
          </section>
        );
      })}
    </div>
  );
};

RemindersByClientList.displayName = "RemindersByClientList";
