export interface TimelineEvent {
  event_type: string;
  timestamp: string;
  binder_id: number | null;
  charge_id: number | null;
  description: string;
  metadata?: Record<string, unknown> | null;
}

export interface TimelineResponse {
  client_id: number;
  events: TimelineEvent[];
  page: number;
  page_size: number;
  total: number;
}
