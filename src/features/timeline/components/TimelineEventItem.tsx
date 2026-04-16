import { FileText, CreditCard } from "lucide-react";
import { IconLabel } from "../../../components/ui/primitives/IconLabel";
import type { TimelineEvent, TimelineEventMetadata } from "../api";
import { cn } from "../../../utils/utils";
import { staggerDelay } from "../../../utils/animation";
import { getEventColor } from "../constants";
import { getTimelineChannelLabel, getTimelineStatusLabel, getTimelineTriggerLabel } from "../labels";
import { formatTimestamp, getEventIcon, getEventTypeLabel } from "../utils";

// ── Metadata sub-components ───────────────────────────────────────────────────

interface MetaRowProps {
  className?: string;
  children: React.ReactNode;
}
const MetaRow: React.FC<MetaRowProps> = ({ className, children }) => (
  <div className={cn("text-xs text-gray-600 rounded px-3 py-2 border", className)}>
    {children}
  </div>
);

const MetaField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div><span className="font-medium">{label}:</span> {value}</div>
);

// ── Status transition ─────────────────────────────────────────────────────────

const StatusTransition: React.FC<{ oldStatus: string; newStatus: string }> = ({
  oldStatus,
  newStatus,
}) => (
  <MetaRow className="bg-info-50 border-info-100 flex items-center gap-2">
    <span className="px-2 py-0.5 rounded bg-info-100 text-info-700 font-medium text-[11px]">
      {getTimelineStatusLabel(oldStatus)}
    </span>
    <span className="text-info-400">←</span>
    <span className="px-2 py-0.5 rounded bg-positive-100 text-positive-700 font-medium text-[11px]">
      {getTimelineStatusLabel(newStatus)}
    </span>
  </MetaRow>
);

// ── Metadata panel ────────────────────────────────────────────────────────────

const EventMetadata: React.FC<{ metadata: TimelineEventMetadata }> = ({ metadata }) => {
  const { old_status, new_status, amount, trigger, channel, provider, external_invoice_id } = metadata;

  return (
    <>
      {old_status && new_status && (
        <StatusTransition oldStatus={old_status} newStatus={new_status} />
      )}

      {amount != null && (
        <MetaRow className="bg-emerald-50 border-emerald-100">
          <MetaField label="סכום" value={`₪${Number(amount).toFixed(2)}`} />
        </MetaRow>
      )}

      {trigger && channel && (
        <MetaRow className="bg-purple-50 border-purple-100">
          <MetaField label="ערוץ" value={getTimelineChannelLabel(channel)} />
          <MetaField label="סוג"  value={getTimelineTriggerLabel(trigger)}  />
        </MetaRow>
      )}

      {external_invoice_id != null && (
        <MetaRow className="bg-orange-50 border-orange-100">
          <MetaField label="ספק"         value={String(provider ?? "לא ידוע")}      />
          <MetaField label="ID חשבונית"  value={String(external_invoice_id)}        />
        </MetaRow>
      )}
    </>
  );
};

// ── Related IDs ───────────────────────────────────────────────────────────────

const RelatedIds: React.FC<{ binderId: number | null; chargeId: number | null }> = ({
  binderId,
  chargeId,
}) => {
  if (!binderId && !chargeId) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {binderId != null && (
        <IconLabel
          icon={<FileText className="h-3 w-3" />}
          label={`קלסר #${binderId}`}
          className="bg-slate-50 text-slate-600 border-slate-200"
        />
      )}
      {chargeId != null && (
        <IconLabel
          icon={<CreditCard className="h-3 w-3" />}
          label={`חיוב #${chargeId}`}
          className="bg-amber-50 text-amber-700 border-amber-200"
        />
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

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
        <div className={cn("h-[10px] w-[10px] rounded-full border-2 bg-white shadow-sm", colors.dotBorder)}>
          <div className={cn("absolute inset-0 m-auto h-[4px] w-[4px] rounded-full", colors.dotBg)} />
        </div>
      </div>

      {/* Event card */}
      <div
        className={cn(
          "flex-1 mb-2 rounded-lg border border-gray-100 bg-white/95 overflow-hidden",
          "border-r-2", colors.cardBorder,
          "transition-all duration-200 hover:shadow-md hover:border-gray-200",
        )}
      >
        {/* Top tint bar */}
        <div className={cn("h-1 w-full bg-gradient-to-l", colors.cardTint, "to-transparent")} />

        <div className="px-4 py-3 space-y-3">
          {/* Header: type badge + timestamp */}
          <div className="flex items-center justify-between gap-3">
            <span className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0",
              colors.badgeBg, colors.badgeText,
            )}>
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
          {ev.description && (
            <p className="text-sm leading-relaxed text-gray-700">{ev.description}</p>
          )}

          {/* Related IDs */}
          <RelatedIds binderId={ev.binder_id} chargeId={ev.charge_id} />

          {/* Metadata */}
          {ev.metadata && <EventMetadata metadata={ev.metadata} />}
        </div>
      </div>
    </li>
  );
};

TimelineEventItem.displayName = "TimelineEventItem";