import type { TimelineParams } from "../../api/timeline.api";

export const timelineKeys = {
  all: ["timeline"] as const,
  client: (clientId: number) => [...timelineKeys.all, "client", clientId] as const,
  events: (clientId: number, params: TimelineParams) =>
    [...timelineKeys.client(clientId), "events", params] as const,
};
