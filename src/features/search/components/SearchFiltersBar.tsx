import { RotateCcw } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import type { SearchFiltersBarProps } from "../types";
import { getSignalLabel, getSlaStateLabel, getWorkStateLabel } from "../../../utils/enums";
import { cn } from "../../../utils/utils";

const WORK_STATE_OPTIONS = [
  { value: "", label: "הכל" },
  { value: "waiting_for_work", label: getWorkStateLabel("waiting_for_work") },
  { value: "in_progress", label: getWorkStateLabel("in_progress") },
  { value: "completed", label: getWorkStateLabel("completed") },
];

const SLA_STATE_OPTIONS = [
  { value: "", label: "הכל" },
  { value: "on_track", label: getSlaStateLabel("on_track") },
  { value: "approaching", label: getSlaStateLabel("approaching") },
  { value: "overdue", label: getSlaStateLabel("overdue") },
];

const SIGNAL_OPTIONS = [
  { value: "missing_permanent_documents", label: getSignalLabel("missing_permanent_documents") },
  { value: "near_sla",                    label: getSignalLabel("near_sla") },
  { value: "overdue",                     label: getSignalLabel("overdue") },
  { value: "ready_for_pickup",            label: getSignalLabel("ready_for_pickup") },
  { value: "unpaid_charges",              label: getSignalLabel("unpaid_charges") },
  { value: "idle_binder",                 label: getSignalLabel("idle_binder") },
];

const SIGNAL_CHIP_STYLES: Record<string, string> = {
  overdue:                     "border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
  near_sla:                    "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100",
  missing_permanent_documents: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
  unpaid_charges:              "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
  ready_for_pickup:            "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100",
  idle_binder:                 "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100",
};

const SIGNAL_CHIP_ACTIVE: Record<string, string> = {
  overdue:                     "bg-red-200 border-red-500",
  near_sla:                    "bg-orange-200 border-orange-500",
  missing_permanent_documents: "bg-amber-200 border-amber-500",
  unpaid_charges:              "bg-yellow-200 border-yellow-500",
  ready_for_pickup:            "bg-blue-200 border-blue-500",
  idle_binder:                 "bg-gray-200 border-gray-500",
};

export const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({ filters, onFilterChange }) => {
  const activeCount =
    [filters.query, filters.client_name, filters.id_number, filters.binder_number, filters.work_state, filters.sla_state, filters.has_signals]
      .filter(Boolean).length + filters.signal_type.length;

  const handleReset = () => {
    onFilterChange("query", "");
    onFilterChange("client_name", "");
    onFilterChange("id_number", "");
    onFilterChange("binder_number", "");
    onFilterChange("work_state", "");
    onFilterChange("sla_state", "");
    onFilterChange("signal_type", []);
    onFilterChange("has_signals", "");
  };

  const toggleSignal = (value: string) => {
    const next = filters.signal_type.includes(value)
      ? filters.signal_type.filter((s) => s !== value)
      : [...filters.signal_type, value];
    onFilterChange("signal_type", next);
  };

  return (
    <div className="space-y-5">
      {/* Text search row */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">חיפוש טקסט</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Input
            label="חיפוש חופשי"
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange("query", e.target.value)}
            placeholder="שם / מספר קלסר"
          />
          <Input
            label="שם לקוח"
            type="text"
            value={filters.client_name}
            onChange={(e) => onFilterChange("client_name", e.target.value)}
            placeholder="שם לקוח"
          />
          <Input
            label="ת.ז / ח.פ"
            type="text"
            value={filters.id_number}
            onChange={(e) => onFilterChange("id_number", e.target.value)}
            placeholder="מספר מזהה"
          />
          <Input
            label="מספר קלסר"
            type="text"
            value={filters.binder_number}
            onChange={(e) => onFilterChange("binder_number", e.target.value)}
            placeholder="BND-..."
          />
        </div>
      </div>

      {/* Status selects */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">סינון סטטוס</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="מצב עבודה"
            value={filters.work_state}
            onChange={(e) => onFilterChange("work_state", e.target.value)}
            options={WORK_STATE_OPTIONS}
          />
          <Select
            label="מצב SLA"
            value={filters.sla_state}
            onChange={(e) => onFilterChange("sla_state", e.target.value)}
            options={SLA_STATE_OPTIONS}
          />
          <Select
            label="יש אותות"
            value={filters.has_signals}
            onChange={(e) => onFilterChange("has_signals", e.target.value)}
            options={[
              { value: "", label: "הכל" },
              { value: "true", label: "כן" },
              { value: "false", label: "לא" },
            ]}
          />
        </div>
      </div>

      {/* Signal toggle chips */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">סינון לפי אות</p>
        <div className="flex flex-wrap gap-2">
          {SIGNAL_OPTIONS.map(({ value, label }) => {
            const active = filters.signal_type.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleSignal(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
                  active
                    ? cn(SIGNAL_CHIP_ACTIVE[value] ?? "bg-gray-200 border-gray-500", "ring-1 ring-offset-1")
                    : (SIGNAL_CHIP_STYLES[value] ?? "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"),
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset footer */}
      {activeCount > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-500">{activeCount} פילטרים פעילים</span>
          <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            איפוס הכל
          </Button>
        </div>
      )}
    </div>
  );
};
