import React from "react";
import { Badge } from "../../../components/ui/Badge";
import type { TimelineEvent } from "../types";

interface TimelineItemProps {
  event: TimelineEvent;
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

export const TimelineItem: React.FC<TimelineItemProps> = ({ event }) => {
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
    </li>
  );
};
