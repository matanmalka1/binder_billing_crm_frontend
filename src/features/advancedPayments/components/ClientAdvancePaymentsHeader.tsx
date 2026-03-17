import { TrendingDown, Edit2 } from "lucide-react";
import type { AdvancePaymentStatus } from "../types";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { getAdvancePaymentStatusLabel } from "../../../utils/enums";
import { YEAR_OPTIONS } from "../utils";
import { ADVANCE_PAYMENT_STATUS_FILTERS } from "../constants";

interface ClientAdvancePaymentsHeaderProps {
  isAdvisor: boolean;
  statusFilter: AdvancePaymentStatus[];
  onToggleStatus: (status: AdvancePaymentStatus) => void;
  year: number;
  onYearChange: (year: number) => void;
  onOpenCreate: () => void;
  onOpenReduction: () => void;
  onOpenEditRate: () => void;
  onGenerateSchedule: () => void;
  isGenerating?: boolean;
}

export const ClientAdvancePaymentsHeader: React.FC<ClientAdvancePaymentsHeaderProps> = ({
  isAdvisor,
  statusFilter,
  onToggleStatus,
  year,
  onYearChange,
  onOpenCreate,
  onOpenReduction,
  onOpenEditRate,
  onGenerateSchedule,
  isGenerating,
}) => (
  <div className="flex items-center justify-between">
    {isAdvisor && (
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={onOpenCreate}>הוסף מקדמה</Button>
        <Button variant="outline" size="sm" onClick={onOpenReduction}>
          <TrendingDown size={14} className="mr-1" />
          בקש הפחתה
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenEditRate}>
          <Edit2 size={14} className="mr-1" />
          עריכת שיעור
        </Button>
        <Button variant="outline" size="sm" onClick={onGenerateSchedule} disabled={isGenerating}>
          {isGenerating ? "יוצר..." : "צור לוח מקדמות לשנה"}
        </Button>
      </div>
    )}
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {ADVANCE_PAYMENT_STATUS_FILTERS.map((status) => {
          const active = statusFilter.includes(status);
          return (
            <button
              key={status}
              type="button"
              onClick={() => onToggleStatus(status)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {getAdvancePaymentStatusLabel(status)}
            </button>
          );
        })}
      </div>
      <div className="w-28">
        <Select value={String(year)} onChange={(e) => onYearChange(Number(e.target.value))} options={YEAR_OPTIONS} />
      </div>
    </div>
  </div>
);

ClientAdvancePaymentsHeader.displayName = "ClientAdvancePaymentsHeader";
