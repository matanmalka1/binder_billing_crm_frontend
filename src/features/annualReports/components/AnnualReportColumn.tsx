import { Inbox } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { getReportStageLabel, getStageColor } from "../../../api/annualReports.utils";
import { staggerDelay } from "../../../utils/animation";
import type { KanbanStage, StageKey } from "../types";
import { STAGE_ACCENT } from "../utils";
import { AnnualReportCard } from "./AnnualReportCard";
import { cn } from "../../../utils/utils";

interface AnnualReportColumnProps {
  stage: KanbanStage;
  stageIndex: number;
  page: number;
  pageSize: number;
  transitioningId: number | null;
  onTransition: (reportId: number, stageKey: StageKey, dir: "forward" | "back") => void;
  onOpenDetail: (reportId: number) => void;
}

export const AnnualReportColumn: React.FC<AnnualReportColumnProps> = ({
  stage,
  stageIndex,
  page,
  pageSize,
  transitioningId,
  onTransition,
  onOpenDetail,
}) => {
  const pagedReports = stage.reports.slice((page - 1) * pageSize, page * pageSize);
  const accent = STAGE_ACCENT[stage.stage] ?? "from-gray-400 to-gray-500";

  return (
    <div
      className="w-72 shrink-0 animate-fade-in flex flex-col"
      style={{ animationDelay: staggerDelay(stageIndex) }}
    >
      {/* Column header */}
      <div className="mb-3 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className={cn("h-1 w-full bg-gradient-to-r", accent)} />
        <div className="flex items-center justify-between px-3 py-2.5">
          <h3 className="text-sm font-semibold text-gray-800">
            {getReportStageLabel(stage.stage)}
          </h3>
          <Badge className={cn("text-xs font-bold tabular-nums", getStageColor(stage.stage))}>
            {stage.reports.length}
          </Badge>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {pagedReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 py-10 text-gray-400">
            <Inbox className="h-7 w-7" />
            <p className="text-xs">אין דוחות בשלב זה</p>
          </div>
        ) : (
          pagedReports.map((report, index) => (
            <AnnualReportCard
              key={report.id}
              report={report}
              stageKey={stage.stage}
              isTransitioning={transitioningId === report.id}
              canMoveBack={stageIndex > 0}
              canMoveForward={stageIndex < 4}
              onTransition={onTransition}
              onOpenDetail={onOpenDetail}
              animationIndex={index}
            />
          ))
        )}
      </div>
    </div>
  );
};