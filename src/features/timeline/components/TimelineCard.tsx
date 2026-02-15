import { Card } from "../../../components/ui/Card";
import type { TimelineEvent } from "../../../api/timeline.api";
import type { ActionCommand } from "../../../lib/actions/types";
import { TimelineEventItem } from "./TimelineEventItem";
import { Clock } from "lucide-react";

export interface TimelineCardProps {
  events: TimelineEvent[];
  activeActionKey: string | null;
  onAction: (action: ActionCommand) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  events,
  activeActionKey,
  onAction,
}) => {
  return (
    <Card variant="elevated" className="overflow-hidden">
      {events.length > 0 ? (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-0 bottom-0 right-8 w-0.5 bg-gradient-to-b from-primary-200 via-primary-300 to-transparent" />

          {/* Events */}
          <ul className="space-y-6 relative">
            {events.map((event, index) => (
              <TimelineEventItem
                key={`${event.timestamp}-${event.event_type}-${index}`}
                event={event}
                index={index}
                onAction={onAction}
                activeActionKey={activeActionKey}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 rounded-full bg-gray-100 p-4 w-fit">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">אין אירועים להצגה</p>
          <p className="mt-1 text-xs text-gray-500">ציר הזמן ריק</p>
        </div>
      )}
    </Card>
  );
};
