import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { mapActions } from "../../../lib/actions/mapActions";
import type { TimelineEvent } from "../../../api/timeline.api";
import type { ActionCommand } from "../../../lib/actions/types";

export interface TimelineItemProps {
  event: TimelineEvent;
  itemKey: string;
  activeActionKey: string | null;
  onAction: (action: ActionCommand) => void;
}


const getEventTypeLabel = (eventType: string) => {
  const labels: Record<string, string> = {
    binder_received: "קליטת תיק",
    binder_returned: "החזרת תיק",
    invoice_created: "יצירת חשבונית",
    charge_created: "יצירת חיוב",
    notification: "התראה",
    notification_sent: "התראה",
  };
  return labels[eventType] ?? "—";
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("he-IL");
};

export const TimelineItem: React.FC<TimelineItemProps> = ({
  event,
  itemKey,
  activeActionKey,
  onAction,
}) => {
  const eventActions = event.actions || event.available_actions || [];
  const scopeKey = `timeline-${itemKey}`;
  const resolvedActions = mapActions(eventActions, { scopeKey });

  return (
    <li className="rounded-md border border-gray-200 p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="info">{getEventTypeLabel(event.event_type)}</Badge>
        <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
      </div>
      <p className="text-sm text-gray-800">{event.description || "—"}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
        <span>תיק: {event.binder_id ?? "—"}</span>
        <span>חיוב: {event.charge_id ?? "—"}</span>
      </div>
      {resolvedActions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {resolvedActions.map((action) => (
            <Button
              key={action.uiKey}
              type="button"
              variant="outline"
              onClick={() => onAction(action)}
              isLoading={activeActionKey === action.uiKey}
              disabled={activeActionKey !== null && activeActionKey !== action.uiKey}
            >
              {action.label || "—"}
            </Button>
          ))}
        </div>
      )}
    </li>
  );
};
