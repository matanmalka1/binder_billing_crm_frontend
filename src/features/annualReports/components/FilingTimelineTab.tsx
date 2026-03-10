import React from "react";
import type { AnnualReportFull } from "../../../api/annualReports.api";
import { TimelineEvent } from "./TimelineEvent";
import type { TimelineEventStatus } from "./TimelineEvent";
import { cn } from "../../../utils/utils";

interface Props {
  reports: AnnualReportFull[];
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("he-IL");
}

function statusLabel(status: AnnualReportFull["status"]): string {
  const map: Record<AnnualReportFull["status"], string> = {
    not_started: "טרם החל",
    collecting_docs: "איסוף מסמכים",
    docs_complete: "מסמכים הושלמו",
    in_preparation: "בהכנה",
    pending_client: "ממתין ללקוח",
    submitted: "הוגש",
    accepted: "התקבל",
    assessment_issued: "שומה הוצאה",
    objection_filed: "הגשת השגה",
    closed: "סגור",
    amended: "עם תיקונים",
  };
  return map[status] ?? status;
}

function deadlineStatus(report: AnnualReportFull): TimelineEventStatus {
  if (!report.filing_deadline) return "pending";
  const now = new Date();
  const deadline = new Date(report.filing_deadline);
  if (report.submitted_at) return "done";
  if (deadline < now) return "overdue";
  const daysLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (daysLeft < 14) return "warning";
  return "pending";
}

export const FilingTimelineTab: React.FC<Props> = ({ reports }) => {
  const now = new Date();

  // Upcoming deadlines: not yet submitted, sorted by filing_deadline asc
  const upcoming = [...reports]
    .filter((r) => !r.submitted_at && r.filing_deadline)
    .sort(
      (a, b) =>
        new Date(a.filing_deadline!).getTime() - new Date(b.filing_deadline!).getTime()
    );

  // Progress bar counts
  const total = reports.length;
  const submittedOnTime = reports.filter(
    (r) =>
      r.submitted_at &&
      r.filing_deadline &&
      new Date(r.submitted_at) <= new Date(r.filing_deadline)
  ).length;
  const pending = reports.filter((r) => !r.submitted_at).length;
  const amended = reports.filter((r) => r.status === "amended").length;

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  // Timeline events derived from report fields
  interface TEvent {
    title: string;
    description: string;
    date: string;
    status: TimelineEventStatus;
  }

  const timelineEvents: TEvent[] = [];

  reports.forEach((r) => {
    const name = r.client_name ?? `דוח #${r.id}`;
    if (r.submitted_at) {
      const onTime =
        r.filing_deadline && new Date(r.submitted_at) <= new Date(r.filing_deadline);
      timelineEvents.push({
        title: `הוגש — ${name} (${r.tax_year})`,
        description: `סטטוס: ${statusLabel(r.status)}`,
        date: formatDate(r.submitted_at),
        status: onTime ? "done" : "warning",
      });
    }
    if (r.filing_deadline) {
      const isPast = new Date(r.filing_deadline) < now;
      const isSubmitted = !!r.submitted_at;
      if (!isSubmitted) {
        timelineEvents.push({
          title: `מועד הגשה — ${name} (${r.tax_year})`,
          description: `סטטוס: ${statusLabel(r.status)}`,
          date: formatDate(r.filing_deadline),
          status: isPast ? "overdue" : "pending",
        });
      }
    }
  });

  // Sort timeline: submitted_at / filing_deadline chronologically desc (most recent first)
  timelineEvents.sort((a, b) => {
    const parseDate = (d: string) => {
      const parts = d.split(".");
      if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
      return 0;
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  return (
    <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Left column */}
      <div className="space-y-6">
        {/* Upcoming deadlines */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">מועדי הגשה קרובים</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400">אין מועדי הגשה ממתינים</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((r) => {
                const st = deadlineStatus(r);
                const colorMap: Record<TimelineEventStatus, string> = {
                  done: "border-green-400 bg-green-50",
                  warning: "border-yellow-400 bg-yellow-50",
                  pending: "border-gray-200 bg-white",
                  overdue: "border-red-400 bg-red-50",
                };
                return (
                  <li
                    key={r.id}
                    className={cn(
                      "rounded-lg border px-4 py-3 flex items-center justify-between gap-3",
                      colorMap[st]
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {r.client_name ?? `דוח #${r.id}`} — {r.tax_year}
                      </p>
                      <p className="text-xs text-gray-500">{statusLabel(r.status)}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 shrink-0">
                      {formatDate(r.filing_deadline)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Progress bars */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">סטטוס הגשות</h3>
          <div className="space-y-3">
            <ProgressBar label="הוגשו בזמן" count={submittedOnTime} pct={pct(submittedOnTime)} color="bg-green-500" />
            <ProgressBar label="ממתין להגשה" count={pending} pct={pct(pending)} color="bg-blue-400" />
            <ProgressBar label="עם תיקונים" count={amended} pct={pct(amended)} color="bg-yellow-400" />
          </div>
        </section>
      </div>

      {/* Right column — vertical timeline */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">היסטוריית אירועים</h3>
        {timelineEvents.length === 0 ? (
          <p className="text-sm text-gray-400">אין אירועים להצגה</p>
        ) : (
          <div>
            {timelineEvents.map((ev, i) => (
              <TimelineEvent
                key={i}
                title={ev.title}
                description={ev.description}
                date={ev.date}
                status={ev.status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProgressBarProps {
  label: string;
  count: number;
  pct: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, count, pct, color }) => (
  <div>
    <div className="flex justify-between text-xs text-gray-600 mb-1">
      <span>{label}</span>
      <span>{count} ({pct}%)</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  </div>
);
