import React from "react";
import { CalendarClock, CalendarCheck, AlertCircle, Clock } from "lucide-react";
import type { AnnualReportFull } from "../../api";
import type { TimelineEventStatus } from "../statusTransition/TimelineEvent";
import { cn } from "../../../../utils/utils";
import { STATUS_LABELS } from "./annualReports.constants";

interface Props { reports: AnnualReportFull[]; }

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("he-IL");
};

const deadlineStatus = (report: AnnualReportFull): TimelineEventStatus => {
  if (!report.filing_deadline) return "pending";
  const now = new Date();
  const deadline = new Date(report.filing_deadline);
  if (report.submitted_at) return "done";
  if (deadline < now) return "overdue";
  if ((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) < 14) return "warning";
  return "pending";
};

const STATUS_COLORS: Record<TimelineEventStatus, string> = {
  done:    "border-green-200 bg-green-50",
  warning: "border-yellow-200 bg-yellow-50",
  pending: "border-gray-200 bg-white",
  overdue: "border-red-200 bg-red-50",
};

const STATUS_ICONS: Record<TimelineEventStatus, React.ReactNode> = {
  done:    <CalendarCheck className="h-4 w-4 text-green-600" />,
  warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  pending: <Clock className="h-4 w-4 text-gray-400" />,
  overdue: <AlertCircle className="h-4 w-4 text-red-500" />,
};

export const UpcomingDeadlinesList: React.FC<Props> = ({ reports }) => {
  const upcoming = [...reports]
    .filter((r) => !r.submitted_at && r.filing_deadline)
    .sort((a, b) => new Date(a.filing_deadline!).getTime() - new Date(b.filing_deadline!).getTime());

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">
        <CalendarClock className="h-4 w-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700">מועדי הגשה קרובים</h3>
      </div>
      <div className="p-4">
        {upcoming.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">אין מועדי הגשה ממתינים</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((r) => {
              const st = deadlineStatus(r);
              return (
                <li key={r.id} className={cn("flex items-center gap-3 rounded-lg border px-4 py-3", STATUS_COLORS[st])}>
                  {STATUS_ICONS[st]}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {r.client_name ?? `דוח #${r.id}`} — {r.tax_year}
                    </p>
                    <p className="text-xs text-gray-500">{STATUS_LABELS[r.status]}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-gray-600">{formatDate(r.filing_deadline)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

UpcomingDeadlinesList.displayName = "UpcomingDeadlinesList";
