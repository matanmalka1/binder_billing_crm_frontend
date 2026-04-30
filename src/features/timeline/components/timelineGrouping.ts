import type { NormalizedTimelineEvent } from '../normalize'
import { formatDateHeading } from '../utils'

export interface EventGroup {
  date: string
  items: NormalizedTimelineEvent[]
}

export const groupEventsByDate = (events: NormalizedTimelineEvent[]): EventGroup[] => {
  const groups = new Map<string, NormalizedTimelineEvent[]>()
  for (const event of events) {
    const key = formatDateHeading(event.displayTimestamp)
    const group = groups.get(key)
    if (group) group.push(event)
    else groups.set(key, [event])
  }
  return Array.from(groups.entries()).map(([date, items]) => ({ date, items }))
}
