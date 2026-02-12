import React from "react";
import { Card } from "../../../components/ui/Card";
import type { ResolvedBackendAction } from "../../../lib/actions/types";
import type { TimelineEvent } from "../types";
import { TimelineItem } from "./TimelineItem";

interface TimelineCardProps {
  events: TimelineEvent[];
  activeActionKey: string | null;
  onAction: (action: ResolvedBackendAction) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  events,
  activeActionKey,
  onAction,
}) => {
  return (
    <Card title="ציר זמן לקוח">
      {events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((event, index) => {
            const itemKey = `${event.timestamp}-${event.event_type}-${index}`;
            return (
            <TimelineItem
              key={itemKey}
              event={event}
              itemKey={itemKey}
              activeActionKey={activeActionKey}
              onAction={onAction}
            />
            );
          })}
        </ul>
      ) : (
        <p className="py-8 text-center text-gray-500">אין אירועים להצגה</p>
      )}
    </Card>
  );
};
