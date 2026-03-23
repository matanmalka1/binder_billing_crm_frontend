import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import type { ScheduleEntry, AnnualReportScheduleKey } from "../../api";
import { getScheduleLabel } from "../../api";
import { cn } from "../../../../utils/utils";
import { AnnexDataPanel } from "./AnnexDataPanel";
import { ScheduleAddForm } from "./ScheduleAddForm";

interface ScheduleChecklistProps {
  reportId: number;
  schedules: ScheduleEntry[];
  onComplete: (schedule: AnnualReportScheduleKey) => void;
  onAdd: (schedule: AnnualReportScheduleKey, notes?: string) => void;
  isLoading: boolean;
  isAdding: boolean;
  completingKey?: AnnualReportScheduleKey | null;
}

export const ScheduleChecklist: React.FC<ScheduleChecklistProps> = ({
  reportId,
  schedules,
  onComplete,
  onAdd,
  isLoading,
  isAdding,
  completingKey,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (schedules.length === 0) {
    return (
      <Card title="נספחים">
        <p className="text-sm text-gray-500">אין נספחים נדרשים לדוח זה</p>
        <div className="mt-3">
          <ScheduleAddForm schedules={schedules} onAdd={onAdd} isAdding={isAdding} />
        </div>
      </Card>
    );
  }

  const completed = schedules.filter((s) => s.is_complete).length;
  const allDone = completed === schedules.length;

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Card
      title="נספחים נדרשים"
      subtitle={allDone ? "✅ כל הנספחים הושלמו" : `${completed}/${schedules.length} הושלמו`}
    >
      <ul className="space-y-2">
        {schedules.map((entry) => {
          const isExpanded = !!expanded[entry.schedule];
          const scheduleLabel = getScheduleLabel(entry.schedule);

          return (
            <li
              key={entry.id}
              className={cn(
                "rounded-lg border transition-colors",
                entry.is_complete
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-white hover:bg-gray-50",
              )}
            >
              <div className="flex items-center justify-between p-3">
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
                      {scheduleLabel}
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggle(entry.schedule)}
                    className="text-gray-400 hover:text-gray-600"
                    title={isExpanded ? "סגור" : "פרוס נתונים"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

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
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 px-3 pb-3">
                  <AnnexDataPanel
                    reportId={reportId}
                    schedule={entry.schedule as AnnualReportScheduleKey}
                    scheduleLabel={scheduleLabel}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3">
        <ScheduleAddForm schedules={schedules} onAdd={onAdd} isAdding={isAdding} />
      </div>
    </Card>
  );
};

ScheduleChecklist.displayName = "ScheduleChecklist";
