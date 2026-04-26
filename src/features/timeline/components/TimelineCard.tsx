import { useMemo } from "react";
import { Clock, InboxIcon } from "lucide-react";
import type { NormalizedTimelineEvent } from "../normalize";
import { TimelineEventItem } from "./TimelineEventItem";
import { formatDateHeading } from "../utils";
import { cn } from "../../../utils/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EventGroup {
  date:  string;
  items: NormalizedTimelineEvent[];
}

// ── Grouping helper ───────────────────────────────────────────────────────────

const groupEventsByDate = (events: NormalizedTimelineEvent[]): EventGroup[] => {
  const groups = new Map<string, NormalizedTimelineEvent[]>();
  for (const event of events) {
    const key = formatDateHeading(event.timestamp);
    const group = groups.get(key);
    if (group) group.push(event);
    else groups.set(key, [event]);
  }
  return Array.from(groups.entries()).map(([date, items]) => ({ date, items }));
};

// ── Empty state ───────────────────────────────────────────────────────────────

interface EmptyTimelineProps {
  hasActiveFilters?: boolean;
}

const EmptyTimeline: React.FC<EmptyTimelineProps> = ({ hasActiveFilters }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center animate-fade-in">
    <div className="rounded-full bg-gray-100 p-4">
      <InboxIcon className="h-7 w-7 text-gray-400" />
    </div>
    <p className="text-sm font-medium text-gray-500">
      {hasActiveFilters ? "לא נמצאו אירועים לפי הסינון" : "אין אירועים בציר הזמן"}
    </p>
    <p className="text-xs text-gray-400">
      {hasActiveFilters ? "נסה לשנות את הפילטרים או את החיפוש" : "אירועים חדשים יופיעו כאן לאחר פעילות לקוח"}
    </p>
  </div>
);

// ── Date group header ─────────────────────────────────────────────────────────

interface GroupHeaderProps {
  date:       string;
  count:      number;
  isFirst:    boolean;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ date, count, isFirst }) => (
  <div className={cn("flex items-center gap-3 px-1 py-2", !isFirst && "mt-4")}>
    <div className="flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600">
      <Clock className="h-3.5 w-3.5 text-slate-400" />
      {date}
    </div>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200" />
    <span className="text-[11px] text-gray-400 whitespace-nowrap">
      {count} {count === 1 ? "אירוע" : "אירועים"}
    </span>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export interface TimelineCardProps {
  events: NormalizedTimelineEvent[];
  hasActiveFilters?: boolean;
  onAction?: (action: NormalizedTimelineEvent["actionsList"][number]) => void;
  activeActionKey?: string | null;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  events,
  hasActiveFilters,
  onAction,
  activeActionKey,
}) => {
  const groups = useMemo(() => groupEventsByDate(events), [events]);

  if (events.length === 0) return <EmptyTimeline hasActiveFilters={hasActiveFilters} />;

  return (
    <div className="space-y-2 animate-fade-in">
      {groups.map((group, groupIndex) => (
        <section key={group.date}>
          <GroupHeader date={group.date} count={group.items.length} isFirst={groupIndex === 0} />

          <div className="relative pr-5">
            {/* Vertical connector line */}
            <div className="pointer-events-none absolute top-3 bottom-3 right-[9px] w-px bg-gradient-to-b from-slate-200 via-slate-200/70 to-transparent" />

            <ul className="space-y-4">
              {group.items.map((event, index) => (
                <TimelineEventItem
                  key={`${event.timestamp}-${event.event_type}-${index}`}
                  timelineEvent={event}
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
