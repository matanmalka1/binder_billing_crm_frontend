import React from "react";
import { Card } from "../../../components/ui/Card";
import type { TimelineEvent } from "../types";
import { TimelineItem } from "./TimelineItem";

interface TimelineCardProps {
  events: TimelineEvent[];
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ events }) => {
  return (
    <Card title="ציר זמן לקוח">
      {events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((event, index) => (
            <TimelineItem key={`${event.timestamp}-${event.event_type}-${index}`} event={event} />
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-gray-500">אין אירועים להצגה</p>
      )}
    </Card>
  );
};
