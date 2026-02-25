import { Button } from "../../../components/ui/Button";
import { ChevronLeft, FileText, CreditCard, Tag } from "lucide-react";
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

interface MetaChipProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const MetaChip: React.FC<MetaChipProps> = ({ icon, label, className }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-mono",
      className,
    )}
  >
    {icon}
    {label}
  </span>
);

export const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  index,
  onAction,
  activeActionKey,
}) => {
  const resolvedActions = mapActions(event.actions ?? event.available_actions);
  const colors = getEventColor(event.event_type);

  return (
    <li
      className="relative flex gap-3 animate-fade-in"
      style={{ animationDelay: staggerDelay(index) }}
    >
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0 mt-3.5">
        <div
          className={cn(
            "h-[10px] w-[10px] rounded-full border-2 bg-white shadow-sm",
            colors.dotBorder,
          )}
        >
          <div className={cn("absolute inset-0 m-auto h-[4px] w-[4px] rounded-full", colors.dotBg)} />
        </div>
      </div>

      {/* Event card */}
      <div
        className={cn(
          "flex-1 mb-1 rounded-xl border border-gray-200/80 bg-white overflow-hidden",
          "border-r-2",
          colors.cardBorder,
          "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        )}
      >
        <div className={cn("h-0.5 w-full bg-gradient-to-l", colors.cardTint, "to-transparent")} />

        <div className="px-4 py-3 space-y-2.5">
          {/* Header: badge + time */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                colors.badgeBg,
                colors.badgeText,
              )}
            >
              <span className={colors.iconColor}>{getEventIcon(event.event_type)}</span>
              {getEventTypeLabel(event.event_type)}
            </span>

            <time
              dateTime={event.timestamp}
              className="text-xs text-gray-400 font-mono tabular-nums"
            >
              {formatTimestamp(event.timestamp)}
            </time>
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-sm leading-relaxed text-gray-700">{event.description}</p>
          )}

          {/* Meta chips */}
          {(event.binder_id ?? event.charge_id ?? event.metadata) && (
            <div className="flex flex-wrap gap-2">
              {event.binder_id && (
                <MetaChip
                  icon={<FileText className="h-3 w-3" />}
                  label={`קלסר #${event.binder_id}`}
                  className="bg-slate-50 text-slate-600 border-slate-200"
                />
              )}
              {event.charge_id && (
                <MetaChip
                  icon={<CreditCard className="h-3 w-3" />}
                  label={`חיוב #${event.charge_id}`}
                  className="bg-amber-50 text-amber-700 border-amber-200"
                />
              )}
              {event.metadata && (
                <MetaChip
                  icon={<Tag className="h-3 w-3" />}
                  label="מטא"
                  className="bg-indigo-50 text-indigo-600 border-indigo-200"
                />
              )}
            </div>
          )}

          {/* Actions */}
          {resolvedActions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100/80">
              {resolvedActions.map((action) => (
                <Button
                  key={action.uiKey}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAction(action)}
                  isLoading={activeActionKey === action.uiKey}
                  disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
                  className="text-xs h-7 px-3 bg-white shadow-sm"
                >
                  {action.label || "—"}
                  <ChevronLeft className="h-3 w-3 opacity-60" />
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};