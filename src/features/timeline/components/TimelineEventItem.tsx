import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Clock, ChevronLeft, FileText, DollarSign } from "lucide-react";
import { mapActions } from "../../../lib/actions/mapActions";
import type { TimelineEvent } from "../../../api/timeline.api";
import type { ActionCommand } from "../../../lib/actions/types";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import {
  formatTimestamp,
  getEventColor,
  getEventIcon,
  getEventTypeLabel,
} from "./timelineEventMeta";

interface TimelineEventItemProps {
  event: TimelineEvent;
  index: number;
  onAction: (action: ActionCommand) => void;
  activeActionKey: string | null;
}

export const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  index,
  onAction,
  activeActionKey,
}) => {
  const eventActions = event.actions || event.available_actions || [];
  const scopeKey = `timeline-${event.timestamp}-${event.event_type}`;
  const resolvedActions = mapActions(eventActions);
  const colors = getEventColor(event.event_type);

  return (
    <li
      className={cn("relative pr-16 animate-fade-in")}
      style={{ animationDelay: staggerDelay(index) }}
    >
      <div
        className={cn(
          "absolute right-6 top-0 z-10",
          "rounded-full p-2 shadow-md",
          "transition-transform hover:scale-110",
          colors.bg,
          colors.border,
          "border-2",
        )}
      >
        <div className={colors.icon}>{getEventIcon(event.event_type)}</div>
      </div>

      <div
        className={cn(
          "rounded-xl border-2 p-4 transition-all duration-200",
          "hover:shadow-lg hover:-translate-y-1",
          colors.border,
          "bg-white",
        )}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Badge variant="info" className="flex items-center gap-1.5">
            {getEventIcon(event.event_type)}
            {getEventTypeLabel(event.event_type)}
          </Badge>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {formatTimestamp(event.timestamp)}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-gray-800 mb-3">
          {event.description || "—"}
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
          {event.binder_id && (
            <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
              <FileText className="h-3 w-3 text-gray-500" />
              <span className="font-mono">קלסר #{event.binder_id}</span>
            </div>
          )}
          {event.charge_id && (
            <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
              <DollarSign className="h-3 w-3 text-gray-500" />
              <span className="font-mono">חיוב #{event.charge_id}</span>
            </div>
          )}
        </div>

        {resolvedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-top border-gray-100">
            {resolvedActions.map((action) => (
              <Button
                key={action.uiKey}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onAction(action)}
                isLoading={activeActionKey === action.uiKey}
                disabled={
                  activeActionKey !== null &&
                  activeActionKey !== action.uiKey
                }
              >
                {action.label || "—"}
                <ChevronLeft className="h-3 w-3" />
              </Button>
            ))}
          </div>
        )}
      </div>
    </li>
  );
};
