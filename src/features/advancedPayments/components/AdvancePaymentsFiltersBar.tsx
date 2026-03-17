import { Select } from "../../../components/ui/Select";
import { ActiveFilterBadges } from "../../../components/ui/ActiveFilterBadges";
import { cn } from "../../../utils/utils";
import { getAdvancePaymentStatusLabel } from "../../../utils/enums";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "../utils";
import type { AdvancePaymentStatus } from "../types";

const STATUS_OPTIONS: { value: AdvancePaymentStatus | ""; label: string }[] = [
  { value: "", label: "כל הסטטוסים" },
  { value: "overdue", label: getAdvancePaymentStatusLabel("overdue") },
  { value: "pending", label: getAdvancePaymentStatusLabel("pending") },
  { value: "partial", label: getAdvancePaymentStatusLabel("partial") },
  { value: "paid", label: getAdvancePaymentStatusLabel("paid") },
];

const MONTH_FILTER_OPTIONS = [
  { value: "", label: "כל החודשים" },
  ...MONTH_OPTIONS,
];

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
          options={MONTH_FILTER_OPTIONS}
          className={cn(month > 0 && "border-primary-400 ring-1 ring-primary-200")}
        />
        <Select
          label="סטטוס"
          value={status}
          onChange={(e) => onParamChange("status", e.target.value)}
          options={STATUS_OPTIONS}
          className={cn(status && "border-primary-400 ring-1 ring-primary-200")}
        />
      </div>

      <ActiveFilterBadges
        badges={[
          month > 0
            ? {
                key: "month",
                label: MONTH_FILTER_OPTIONS.find((o) => o.value === String(month))?.label ?? String(month),
                onRemove: () => onParamChange("month", ""),
              }
            : null,
          status
            ? {
                key: "status",
                label: STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status,
                onRemove: () => onParamChange("status", ""),
              }
            : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleReset}
      />
    </div>
  );
};

AdvancePaymentsFiltersBar.displayName = "AdvancePaymentsFiltersBar";
