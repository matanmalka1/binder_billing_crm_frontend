import { CheckCircle2, Circle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import type { ScheduleEntry, AnnualReportScheduleKey } from "../../../api/annualReports.api";
import { getScheduleLabel } from "../../../api/annualReports.extended.utils";
import { cn } from "../../../utils/utils";

interface ScheduleChecklistProps {
  schedules: ScheduleEntry[];
  onComplete: (schedule: AnnualReportScheduleKey) => void;
  isLoading: boolean;
  completingKey?: AnnualReportScheduleKey | null;
}

export const ScheduleChecklist: React.FC<ScheduleChecklistProps> = ({
  schedules,
  onComplete,
  isLoading,
  completingKey,
}) => {
  if (schedules.length === 0) {
    return (
      <Card title="נספחים">
        <p className="text-sm text-gray-500">אין נספחים נדרשים לדוח זה</p>
      </Card>
    );
  }

  const completed = schedules.filter((s) => s.is_complete).length;
  const allDone = completed === schedules.length;

  return (
    <Card
      title="נספחים נדרשים"
      subtitle={allDone ? "✅ כל הנספחים הושלמו" : `${completed}/${schedules.length} הושלמו`}
    >
      <ul className="space-y-2">
        {schedules.map((entry) => (
          <li
            key={entry.id}
            className={cn(
              "flex items-center justify-between rounded-lg border p-3 transition-colors",
              entry.is_complete
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-white hover:bg-gray-50",
            )}
          >
            <div className="flex items-center gap-3">
              {entry.is_complete ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 flex-shrink-0 text-gray-400" />
              )}
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    entry.is_complete ? "text-green-800" : "text-gray-800",
                  )}
                >
                  {getScheduleLabel(entry.schedule)}
                </p>
                {entry.notes && <p className="text-xs text-gray-500">{entry.notes}</p>}
                {entry.completed_at && (
                  <p className="text-xs text-green-600">
                    הושלם:{" "}
                    {format(parseISO(entry.completed_at), "d.M.yyyy", { locale: he })}
                  </p>
                )}
              </div>
            </div>

            {!entry.is_complete && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onComplete(entry.schedule as AnnualReportScheduleKey)}
                isLoading={isLoading && completingKey === entry.schedule}
                disabled={isLoading}
              >
                סמן הושלם
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
};