import type {
  TimelineBinderStatus,
  TimelineNotificationChannel,
  TimelineNotificationTrigger,
} from "./api/contracts";

const TIMELINE_STATUS_LABELS: Record<TimelineBinderStatus, string> = {
  none: "חדש",
  in_office: "במשרד",
  ready_for_pickup: "מוכן לאיסוף",
  returned: "הוחזר",
};

const TIMELINE_CHANNEL_LABELS: Record<TimelineNotificationChannel, string> = {
  whatsapp: "WhatsApp",
  email: "דוא״ל",
  sms: "SMS",
};

const TIMELINE_TRIGGER_LABELS: Record<TimelineNotificationTrigger, string> = {
  binder_received: "קלסר התקבל",
  binder_ready_for_pickup: "קלסר מוכן לאיסוף",
  manual_payment_reminder: "תזכורת תשלום",
};

export const getTimelineStatusLabel = (
  status: TimelineBinderStatus | string,
): string => TIMELINE_STATUS_LABELS[status as TimelineBinderStatus] ?? status;

export const getTimelineChannelLabel = (
  channel: TimelineNotificationChannel | string,
): string => TIMELINE_CHANNEL_LABELS[channel as TimelineNotificationChannel] ?? channel;

export const getTimelineTriggerLabel = (
  trigger: TimelineNotificationTrigger | string,
): string => TIMELINE_TRIGGER_LABELS[trigger as TimelineNotificationTrigger] ?? trigger;
