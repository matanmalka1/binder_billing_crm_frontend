import type {
  TimelineBinderStatus,
  TimelineNotificationChannel,
  TimelineNotificationTrigger,
} from "./api/contracts";
import { BINDER_STATUS_LABELS } from "../../utils/enums";

// ── Label maps ────────────────────────────────────────────────────────────────

const BINDER_STATUS_LABEL_MAP: Record<TimelineBinderStatus, string> = {
  none:             "חדש",
  in_office:        BINDER_STATUS_LABELS.in_office,
  ready_for_pickup: BINDER_STATUS_LABELS.ready_for_pickup,
  returned:         BINDER_STATUS_LABELS.returned,
};

const CHANNEL_LABEL_MAP: Record<TimelineNotificationChannel, string> = {
  whatsapp: "WhatsApp",
  email:    "דוא״ל",
  sms:      "SMS",
};

const TRIGGER_LABEL_MAP: Record<TimelineNotificationTrigger, string> = {
  binder_received:          "קלסר התקבל",
  binder_ready_for_pickup:  "קלסר מוכן לאיסוף",
  manual_payment_reminder:  "תזכורת תשלום",
};

// ── Typed lookup helpers (fall back to raw value if unknown) ──────────────────

export const getTimelineStatusLabel = (status: string): string =>
  BINDER_STATUS_LABEL_MAP[status as TimelineBinderStatus] ?? status;

export const getTimelineChannelLabel = (channel: string): string =>
  CHANNEL_LABEL_MAP[channel as TimelineNotificationChannel] ?? channel;

export const getTimelineTriggerLabel = (trigger: string): string =>
  TRIGGER_LABEL_MAP[trigger as TimelineNotificationTrigger] ?? trigger;