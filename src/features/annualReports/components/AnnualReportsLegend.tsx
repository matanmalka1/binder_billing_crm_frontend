import { User } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { getReportStageLabel, getStageColor } from "../../../api/annualReports.utils";
import { STAGE_ORDER } from "../types";
import { cn } from "../../../utils/utils";

export const AnnualReportsLegend: React.FC = () => (
  <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="flex items-center gap-2 mb-3">
      <User className="h-5 w-5 text-primary-600" />
      <h4 className="text-sm font-semibold text-gray-900">מקרא</h4>
    </div>
    <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-5">
      {STAGE_ORDER.map((stage) => (
        <div key={stage} className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-full", getStageColor(stage).split(" ")[0])} />
          <span className="text-gray-700">{getReportStageLabel(stage)}</span>
        </div>
      ))}
    </div>
  </Card>
);
