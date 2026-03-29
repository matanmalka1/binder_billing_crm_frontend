import { IconLabel } from "../../../components/ui/primitives/IconLabel";
import { FileText, CreditCard } from "lucide-react";
import type { TimelineEvent } from "../api";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import { getEventColor } from "../constants";
import {
  getTimelineChannelLabel,
  getTimelineStatusLabel,
  getTimelineTriggerLabel,
} from "../labels";
import {
  formatTimestamp,
  getEventIcon,
  getEventTypeLabel,
} from "../utils";

interface TimelineEventItemProps {
  timelineEvent: TimelineEvent;
  index: number;
}

export const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  timelineEvent: ev,
  index,
}) => {
  const colors = getEventColor(ev.event_type);

  return (
    <li
      className="relative flex gap-4 animate-fade-in"
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
          "flex-1 mb-2 rounded-lg border border-gray-100 bg-white/95 overflow-hidden",
          "border-r-2",
          colors.cardBorder,
          "transition-all duration-200 hover:shadow-md hover:border-gray-200",
        )}
      >
        <div className={cn("h-1 w-full bg-gradient-to-l", colors.cardTint, "to-transparent")} />

        <div className="px-4 py-3 space-y-3">
          {/* Header: badge + time */}
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0",
                colors.badgeBg,
                colors.badgeText,
              )}
            >
              <span className={colors.iconColor}>{getEventIcon(ev.event_type)}</span>
              {getEventTypeLabel(ev.event_type)}
            </span>

            <time
              dateTime={ev.timestamp}
              className="text-xs text-gray-400 font-mono tabular-nums flex-shrink-0"
            >
              {formatTimestamp(ev.timestamp)}
            </time>
          </div>

          {/* Description */}
          {!!ev.description && (
            <p className="text-sm leading-relaxed text-gray-700">{ev.description}</p>
          )}

          {/* Related IDs */}
          {!!(ev.binder_id || ev.charge_id) && (
            <div className="flex flex-wrap gap-2">
              {!!ev.binder_id && (
                <IconLabel
                  icon={<FileText className="h-3 w-3" />}
                  label={`קלסר #${ev.binder_id}`}
                  className="bg-slate-50 text-slate-600 border-slate-200"
                />
              )}
              {!!ev.charge_id && (
                <IconLabel
                  icon={<CreditCard className="h-3 w-3" />}
                  label={`חיוב #${ev.charge_id}`}
                  className="bg-amber-50 text-amber-700 border-amber-200"
                />
              )}
            </div>
          )}

          {/* Status transitions */}
          {!!(ev.metadata?.old_status && ev.metadata?.new_status) && (
            <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-100 rounded px-3 py-2">
              <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium text-[11px]">
                {getTimelineStatusLabel(ev.metadata.old_status)}
              </span>
              <span className="text-blue-400">←</span>
              <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium text-[11px]">
                {getTimelineStatusLabel(ev.metadata.new_status)}
              </span>
            </div>
          )}

          {/* Amount display */}
          {!!(ev.metadata?.amount) && (
            <div className="text-xs text-gray-600 bg-emerald-50 border border-emerald-100 rounded px-3 py-2">
              <span className="font-medium">סכום:</span> ₪{Number(ev.metadata.amount).toFixed(2)}
            </div>
          )}

          {/* Notification channel info */}
          {!!(ev.metadata?.trigger && ev.metadata?.channel) && (
            <div className="text-xs text-gray-600 bg-purple-50 border border-purple-100 rounded px-3 py-2">
              <div><span className="font-medium">ערוץ:</span> {getTimelineChannelLabel(ev.metadata.channel)}</div>
              <div><span className="font-medium">סוג:</span> {getTimelineTriggerLabel(ev.metadata.trigger)}</div>
            </div>
          )}

          {/* Invoice info */}
          {!!(ev.metadata?.external_invoice_id) && (
            <div className="text-xs text-gray-600 bg-orange-50 border border-orange-100 rounded px-3 py-2">
              <div><span className="font-medium">ספק:</span> {String(ev.metadata.provider || 'לא ידוע')}</div>
              <div><span className="font-medium">ID חשבונית:</span> {String(ev.metadata.external_invoice_id)}</div>
            </div>
          )}


        </div>
      </div>
    </li>
  );
};

TimelineEventItem.displayName = "TimelineEventItem";
