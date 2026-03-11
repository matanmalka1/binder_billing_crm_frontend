import { cn } from "../../../../utils/utils";

export type TimelineEventStatus = "done" | "warning" | "pending" | "overdue";

interface Props {
  title: string;
  description: string;
  date: string;
  status: TimelineEventStatus;
  amount?: string;
}

const STATUS_DOT: Record<TimelineEventStatus, string> = {
  done: "bg-green-500",
  warning: "bg-yellow-400",
  pending: "bg-gray-300",
  overdue: "bg-red-500",
};

const STATUS_ICON: Record<TimelineEventStatus, string> = {
  done: "✅",
  warning: "🟡",
  pending: "⬜",
  overdue: "🔴",
};

export const TimelineEvent: React.FC<Props> = ({
  title,
  description,
  date,
  status,
  amount,
}) => (
  <div className="flex gap-3">
    {/* Dot + line */}
    <div className="flex flex-col items-center">
      <span className={cn("h-3 w-3 shrink-0 rounded-full mt-1", STATUS_DOT[status])} />
      <div className="w-px flex-1 bg-gray-200 mt-1" />
    </div>

    {/* Content */}
    <div className="pb-5 flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-800">
            <span className="mr-1">{STATUS_ICON[status]}</span>
            {title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          {amount && (
            <p className={cn(
              "text-xs font-semibold mt-0.5",
              status === "overdue" || status === "warning" ? "text-red-600" : "text-gray-700"
            )}>
              {amount}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-400 shrink-0">{date}</span>
      </div>
    </div>
  </div>
);
