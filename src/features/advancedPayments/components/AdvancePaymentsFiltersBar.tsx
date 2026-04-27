import { Select } from "../../../components/ui/inputs/Select";
import { ToolbarContainer } from "../../../components/ui/layout/ToolbarContainer";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import { cn } from "../../../utils/utils";
import { YEAR_OPTIONS } from "../utils";
import { ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL, ADVANCE_PAYMENT_MONTH_FILTER_OPTIONS } from "../constants";
import type { AdvancePaymentStatus } from "../types";
import { ACTIVE_FILTER_CLASS } from "./advancePaymentComponent.constants";

interface AdvancePaymentsFiltersBarProps {
  year: number;
  month: number;
  status: AdvancePaymentStatus | "";
  onParamChange: (key: string, value: string) => void;
}

export const AdvancePaymentsFiltersBar = ({
  year,
  month,
  status,
  onParamChange,
}: AdvancePaymentsFiltersBarProps) => {
  const handleReset = () => {
    onParamChange("month", "");
    onParamChange("status", "");
  };

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="שנת מס"
            value={String(year)}
            onChange={(e) => onParamChange("year", e.target.value)}
            options={YEAR_OPTIONS}
          />
          <Select
            label="חודש"
            value={month > 0 ? String(month) : ""}
            onChange={(e) => onParamChange("month", e.target.value)}
            options={ADVANCE_PAYMENT_MONTH_FILTER_OPTIONS}
            className={cn(month > 0 && ACTIVE_FILTER_CLASS)}
          />
          <Select
            label="סטטוס"
            value={status}
            onChange={(e) => onParamChange("status", e.target.value)}
            options={ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL}
            className={cn(status && ACTIVE_FILTER_CLASS)}
          />
        </div>

        <ActiveFilterBadges
          badges={[
            month > 0
              ? {
                  key: "month",
                  label: ADVANCE_PAYMENT_MONTH_FILTER_OPTIONS.find((o) => o.value === String(month))?.label ?? String(month),
                  onRemove: () => onParamChange("month", ""),
                }
              : null,
            status
              ? {
                  key: "status",
                  label: ADVANCE_PAYMENT_STATUS_OPTIONS_WITH_ALL.find((o) => o.value === status)?.label ?? status,
                  onRemove: () => onParamChange("status", ""),
                }
              : null,
          ].filter((b): b is NonNullable<typeof b> => b !== null)}
          onReset={handleReset}
        />
      </div>
    </ToolbarContainer>
  );
};

AdvancePaymentsFiltersBar.displayName = "AdvancePaymentsFiltersBar";
