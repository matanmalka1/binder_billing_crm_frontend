import React from "react";
import { Badge } from "../../../components/ui/Badge";
import type { ResolvedBackendAction } from "../../../lib/actions/types";
import type { TimelineEvent } from "../types";
import { TimelineActionRow } from "./TimelineActionRow";

interface TimelineItemProps {
  event: TimelineEvent;
  itemKey: string;
  activeActionKey: string | null;
  onAction: (action: ResolvedBackendAction) => void;
}

const getEventTypeLabel = (eventType: string) => {
  const labels: Record<string, string> = {
    binder_received: "קליטת תיק",
    binder_returned: "החזרת תיק",
    invoice_created: "יצירת חשבונית",
    charge_created: "יצירת חיוב",
    notification: "התראה",
    notification_sent: "התראה",
  };
  return labels[eventType] ?? "—";
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("he-IL");
};

export const TimelineItem: React.FC<TimelineItemProps> = ({
  event,
  itemKey,
  activeActionKey,
  onAction,
}) => {
  const eventActions = event.actions || event.available_actions || [];

  return (
    <li className="rounded-md border border-gray-200 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="info">{getEventTypeLabel(event.event_type)}</Badge>
        <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
      </div>
      <p className="text-sm text-gray-800">{event.description || "—"}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
        <span>תיק: {event.binder_id ?? "—"}</span>
        <span>חיוב: {event.charge_id ?? "—"}</span>
      </div>
      <TimelineActionRow
        actions={eventActions}
        binderId={event.binder_id}
        chargeId={event.charge_id}
        scopeKey={`timeline-${itemKey}`}
        activeActionKey={activeActionKey}
        onAction={onAction}
      />
    </li>
  );
};
