import React from "react";
import { CalendarCheck, CalendarClock } from "lucide-react";
import type { AnnualReportFull } from "../../../../api/annualReport.api";
import { TimelineEvent } from "../statusTransition/TimelineEvent";
import type { TimelineEventStatus } from "../statusTransition/TimelineEvent";
import { cn } from "../../../../utils/utils";
import { UpcomingDeadlinesList } from "./UpcomingDeadlinesList";

interface Props { reports: AnnualReportFull[]; }

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("he-IL");
};

export const STATUS_LABELS: Record<AnnualReportFull["status"], string> = {
  not_started: "טרם החל", collecting_docs: "איסוף מסמכים", docs_complete: "מסמכים הושלמו",
  in_preparation: "בהכנה", pending_client: "ממתין ללקוח", submitted: "הוגש",
  accepted: "התקבל", assessment_issued: "שומה הוצאה", objection_filed: "הגשת השגה",
  closed: "סגור", amended: "עם תיקונים",
};

interface ProgressBarProps { label: string; count: number; pct: number; color: string; }

const ProgressBar: React.FC<ProgressBarProps> = ({ label, count, pct, color }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between text-xs text-gray-600">
      <span className="font-medium">{label}</span>
      <span className="text-gray-400">{count} ({pct}%)</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

export const FilingTimelineTab: React.FC<Props> = ({ reports }) => {
  const now = new Date();
  const total = reports.length;
  const submittedOnTime = reports.filter(
    (r) => r.submitted_at && r.filing_deadline && new Date(r.submitted_at) <= new Date(r.filing_deadline)
  ).length;
  const pending = reports.filter((r) => !r.submitted_at).length;
  const amended = reports.filter((r) => r.status === "amended").length;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  interface TEvent { title: string; description: string; date: string; status: TimelineEventStatus; }
  const timelineEvents: TEvent[] = [];

  reports.forEach((r) => {
    const name = r.client_name ?? `דוח #${r.id}`;
    if (r.submitted_at) {
      const onTime = r.filing_deadline && new Date(r.submitted_at) <= new Date(r.filing_deadline);
      timelineEvents.push({ title: `הוגש — ${name} (${r.tax_year})`,
        description: `סטטוס: ${STATUS_LABELS[r.status]}`, date: formatDate(r.submitted_at), status: onTime ? "done" : "warning" });
    }
    if (r.filing_deadline && !r.submitted_at) {
      timelineEvents.push({ title: `מועד הגשה — ${name} (${r.tax_year})`,
        description: `סטטוס: ${STATUS_LABELS[r.status]}`, date: formatDate(r.filing_deadline),
        status: new Date(r.filing_deadline) < now ? "overdue" : "pending" });
    }
  });

  timelineEvents.sort((a, b) => {
    const parse = (d: string) => { const p = d.split("."); return p.length === 3 ? new Date(`${p[2]}-${p[1]}-${p[0]}`).getTime() : 0; };
    return parse(b.date) - parse(a.date);
  });

  return (
    <div dir="rtl" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <UpcomingDeadlinesList reports={reports} />
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">סטטוס הגשות</h3>
          <div className="space-y-4">
            <ProgressBar label="הוגשו בזמן" count={submittedOnTime} pct={pct(submittedOnTime)} color="bg-green-500" />
            <ProgressBar label="ממתין להגשה" count={pending} pct={pct(pending)} color="bg-blue-400" />
            <ProgressBar label="עם תיקונים" count={amended} pct={pct(amended)} color="bg-yellow-400" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-3">
          <CalendarCheck className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700">היסטוריית אירועים</h3>
        </div>
        <div className="p-4">
          {timelineEvents.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">אין אירועים להצגה</p>
          ) : (
            <div>{timelineEvents.map((ev, i) => (
              <TimelineEvent key={i} title={ev.title} description={ev.description} date={ev.date} status={ev.status} />
            ))}</div>
          )}
        </div>
      </div>
    </div>
  );
};

FilingTimelineTab.displayName = "FilingTimelineTab";
