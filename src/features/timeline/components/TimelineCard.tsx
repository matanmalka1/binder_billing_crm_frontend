import { useMemo } from "react";
import type { TimelineEvent } from "../../../api/timeline.api";
import type { ActionCommand } from "../../../lib/actions/types";
import { TimelineEventItem } from "./TimelineEventItem";
import { Clock, InboxIcon } from "lucide-react";
import { formatDateHeading } from "./timelineEventMeta";
import { cn } from "../../../utils/utils";

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
  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    events.forEach((event) => {
      const dateKey = formatDateHeading(event.timestamp);
      groups[dateKey] = groups[dateKey] ? [...groups[dateKey], event] : [event];
    });
    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center animate-fade-in">
        <div className="rounded-full bg-gray-100 p-4">
          <InboxIcon className="h-7 w-7 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">אין אירועים להצגה</p>
        <p className="text-xs text-gray-400">נסה לשנות את הפילטרים או לרענן</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      {groupedEvents.map((group, groupIndex) => (
        <section key={group.date}>
          <div
            className={cn(
              "flex items-center gap-3 px-1 py-2",
              groupIndex > 0 && "mt-4",
            )}
          >
            <div className="flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {group.date}
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200" />
            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              {group.items.length} אירועים
            </span>
          </div>

          <div className="relative pr-5">
            <div className="pointer-events-none absolute top-3 bottom-3 right-[9px] w-px bg-gradient-to-b from-slate-200 via-slate-200/70 to-transparent" />
            <ul className="space-y-3">
              {group.items.map((event, index) => (
                <TimelineEventItem
                  key={`${event.timestamp}-${event.event_type}-${index}`}
                  event={event}
                  index={index + groupIndex * 1000}
                  onAction={onAction}
                  activeActionKey={activeActionKey}
                />
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
};

TimelineCard.displayName = "TimelineCard";