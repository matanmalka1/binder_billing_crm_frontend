import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  Clock,
  FileText,
  DollarSign,
  Bell,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { mapActions } from "../../../lib/actions/mapActions";
import type { TimelineEvent } from "../../../api/timeline.api";
import type { ActionCommand } from "../../../lib/actions/types";
import { cn } from "../../../utils/utils";

export interface TimelineCardProps {
  events: TimelineEvent[];
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
  return labels[eventType] ?? "אירוע";
};

const getEventIcon = (eventType: string) => {
  const icons: Record<string, React.ReactNode> = {
    binder_received: <FileText className="h-4 w-4" />,
    binder_returned: <FileText className="h-4 w-4" />,
    invoice_created: <DollarSign className="h-4 w-4" />,
    charge_created: <DollarSign className="h-4 w-4" />,
    notification: <Bell className="h-4 w-4" />,
    notification_sent: <Bell className="h-4 w-4" />,
  };
  return icons[eventType] ?? <AlertCircle className="h-4 w-4" />;
};

const getEventColor = (eventType: string) => {
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    binder_received: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
    },
    binder_returned: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
    },
    invoice_created: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600",
    },
    charge_created: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
    },
    notification: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
    },
    notification_sent: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
    },
  };
  return (
    colors[eventType] ?? {
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: "text-gray-600",
    }
  );
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
            {events.map((event, index) => {
              const eventActions =
                event.actions || event.available_actions || [];
              const scopeKey = `timeline-${event.timestamp}-${event.event_type}`;
              const resolvedActions = mapActions(eventActions, { scopeKey });
              const colors = getEventColor(event.event_type);

              return (
                <li
                  key={`${event.timestamp}-${event.event_type}-${index}`}
                  className={cn("relative pr-16 animate-fade-in")}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Timeline Dot */}
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
                    <div className={colors.icon}>
                      {getEventIcon(event.event_type)}
                    </div>
                  </div>

                  {/* Event Card */}
                  <div
                    className={cn(
                      "rounded-xl border-2 p-4 transition-all duration-200",
                      "hover:shadow-lg hover:-translate-y-1",
                      colors.border,
                      "bg-white",
                    )}
                  >
                    {/* Event Header */}
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <Badge
                        variant="info"
                        className="flex items-center gap-1.5"
                      >
                        {getEventIcon(event.event_type)}
                        {getEventTypeLabel(event.event_type)}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(event.timestamp)}
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className="text-sm leading-relaxed text-gray-800 mb-3">
                      {event.description || "—"}
                    </p>

                    {/* Event Metadata */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
                      {event.binder_id && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
                          <FileText className="h-3 w-3 text-gray-500" />
                          <span className="font-mono">
                            תיק #{event.binder_id}
                          </span>
                        </div>
                      )}
                      {event.charge_id && (
                        <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
                          <DollarSign className="h-3 w-3 text-gray-500" />
                          <span className="font-mono">
                            חיוב #{event.charge_id}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Event Actions */}
                    {resolvedActions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
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
                            rightIcon={<ChevronLeft className="h-3 w-3" />}
                          >
                            {action.label || "—"}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
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
