import type { TimelineEvent } from "../../api/timeline.api";
import type { BackendActionInput, ActionCommand } from "../../lib/actions/types";

export interface TimelineCardProps {
  events: TimelineEvent[];
  activeActionKey: string | null;
  onAction: (action: ActionCommand) => void;
}

export interface TimelineItemProps {
  event: TimelineEvent;
  itemKey: string;
  activeActionKey: string | null;
  onAction: (action: ActionCommand) => void;
}
