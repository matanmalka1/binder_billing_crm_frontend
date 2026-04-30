import { CalendarClock, InboxIcon } from 'lucide-react'
import type { NormalizedTimelineEvent } from '../normalize'
import { formatTimelineDate } from '../utils'

interface UpcomingDeadlinesCardProps {
  deadlines: NormalizedTimelineEvent[]
}

const EmptyUpcomingDeadlines: React.FC = () => (
  <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 px-4 py-5 text-center">
    <InboxIcon className="mx-auto mb-2 h-5 w-5 text-gray-400" />
    <p className="text-sm font-medium text-gray-500">אין מועדים קרובים</p>
  </div>
)

export const UpcomingDeadlinesCard: React.FC<UpcomingDeadlinesCardProps> = ({ deadlines }) => {
  const nextDeadline = deadlines[0]

  return (
    <section className="rounded-2xl border border-gray-200/60 bg-white/95 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-teal-100 p-2 text-teal-700">
            <CalendarClock className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">מועדים קרובים</h3>
            {nextDeadline && (
              <p className="text-xs text-gray-500">
                המועד הבא: {formatTimelineDate(nextDeadline.displayTimestamp)}
              </p>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400">{deadlines.length} מועדים</span>
      </div>

      {deadlines.length === 0 ? (
        <EmptyUpcomingDeadlines />
      ) : (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {deadlines.map((deadline, index) => (
            <article
              key={`${deadline.displayTimestamp}-${deadline.title}-${index}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-teal-100 bg-teal-50/50 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{deadline.title}</p>
                {deadline.secondary && (
                  <p className="mt-1 truncate text-xs text-gray-500">{deadline.secondary}</p>
                )}
                {deadline.relatedEntity && (
                  <p className="mt-1 text-xs text-teal-700">{deadline.relatedEntity}</p>
                )}
              </div>
              <time
                dateTime={deadline.displayTimestamp}
                className="shrink-0 text-xs font-semibold text-teal-700"
              >
                {formatTimelineDate(deadline.displayTimestamp)}
              </time>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

UpcomingDeadlinesCard.displayName = 'UpcomingDeadlinesCard'
