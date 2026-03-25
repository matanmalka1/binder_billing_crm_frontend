import { IconLabel } from "../../../components/ui/IconLabel";
import { FileText, CreditCard } from "lucide-react";
import type { TimelineEvent } from "../api";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import { getEventColor } from "../constants";
import {
  formatTimestamp,
  getEventIcon,
  getEventTypeLabel,
} from "../utils";

// Status translation map
const STATUS_HE: Record<string, string> = {
  "none": "חדש",
  "in_office": "במשרד",
  "ready_for_pickup": "מוכן לאיסוף",
  "returned": "הוחזר",
};

// Channel translation map
const CHANNEL_HE: Record<string, string> = {
  "whatsapp": "WhatsApp",
  "email": "דוא״ל",
  "sms": "SMS",
};

// Trigger translation map
const TRIGGER_HE: Record<string, string> = {
  "binder_received": "קלסר התקבל",
  "binder_ready_for_pickup": "קלסר מוכן לאיסוף",
  "manual_payment_reminder": "תזכורת תשלום",
};

const formatStatus = (status: string): string => STATUS_HE[status] || status;
const formatChannel = (channel: string): string => CHANNEL_HE[channel] || channel;
const formatTrigger = (trigger: string): string => TRIGGER_HE[trigger] || trigger;

interface TimelineEventItemProps {
  event: TimelineEvent;
  index: number;
}

export const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  index,
}) => {
  const colors = getEventColor(event.event_type);

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
              <span className={colors.iconColor}>{getEventIcon(event.event_type)}</span>
              {getEventTypeLabel(event.event_type)}
            </span>

            <time
              dateTime={event.timestamp}
              className="text-xs text-gray-400 font-mono tabular-nums flex-shrink-0"
            >
              {formatTimestamp(event.timestamp)}
            </time>
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-sm leading-relaxed text-gray-700">{event.description}</p>
          )}

          {/* Related IDs */}
          {(event.binder_id || event.charge_id) && (
            <div className="flex flex-wrap gap-2">
              {event.binder_id && (
                <IconLabel
                  icon={<FileText className="h-3 w-3" />}
                  label={`קלסר #${event.binder_id}`}
                  className="bg-slate-50 text-slate-600 border-slate-200"
                />
              )}
              {event.charge_id && (
                <IconLabel
                  icon={<CreditCard className="h-3 w-3" />}
                  label={`חיוב #${event.charge_id}`}
                  className="bg-amber-50 text-amber-700 border-amber-200"
                />
              )}
            </div>
          )}

          {/* Status transitions */}
          {event.metadata?.old_status && event.metadata?.new_status && (
            <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-100 rounded px-3 py-2">
              <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium text-[11px]">
                {formatStatus(event.metadata.old_status as string)}
              </span>
              <span className="text-blue-400">←</span>
              <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium text-[11px]">
                {formatStatus(event.metadata.new_status as string)}
              </span>
            </div>
          )}

          {/* Amount display */}
          {event.metadata?.amount && (
            <div className="text-xs text-gray-600 bg-emerald-50 border border-emerald-100 rounded px-3 py-2">
              <span className="font-medium">סכום:</span> ₪{Number(event.metadata.amount).toFixed(2)}
            </div>
          )}

          {/* Notification channel info */}
          {event.metadata?.trigger && event.metadata?.channel && (
            <div className="text-xs text-gray-600 bg-purple-50 border border-purple-100 rounded px-3 py-2">
              <div><span className="font-medium">ערוץ:</span> {formatChannel(event.metadata.channel as string)}</div>
              <div><span className="font-medium">סוג:</span> {formatTrigger(event.metadata.trigger as string)}</div>
            </div>
          )}

          {/* Invoice info */}
          {event.metadata?.external_invoice_id && (
            <div className="text-xs text-gray-600 bg-orange-50 border border-orange-100 rounded px-3 py-2">
              <div><span className="font-medium">ספק:</span> {String(event.metadata.provider || 'לא ידוע')}</div>
              <div><span className="font-medium">ID חשבונית:</span> {event.metadata.external_invoice_id}</div>
            </div>
          )}


        </div>
      </div>
    </li>
  );
};

TimelineEventItem.displayName = "TimelineEventItem";
