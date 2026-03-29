import { RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { Button } from "../../../components/ui/primitives/Button";
import type { SearchFiltersBarProps } from "../types";
import { getSignalLabel } from "../../../utils/enums";
import { cn } from "../../../utils/utils";
import { WORK_STATE_OPTIONS, SIGNAL_TYPE_OPTIONS } from "../../../constants/filterOptions.constants";

const SIGNAL_CHIP_STYLES: Record<string, string> = {
  missing_permanent_documents: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
  unpaid_charges: "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
  ready_for_pickup: "border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100",
  idle_binder: "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100",
};

const SIGNAL_CHIP_ACTIVE: Record<string, string> = {
  missing_permanent_documents: "bg-amber-200 border-amber-500 text-amber-800",
  unpaid_charges: "bg-yellow-200 border-yellow-500 text-yellow-800",
  ready_for_pickup: "bg-primary-200 border-primary-500 text-primary-800",
  idle_binder: "bg-gray-200 border-gray-500 text-gray-700",
};

const HAS_SIGNALS_OPTIONS = [
  { value: "", label: "הכל" },
  { value: "true", label: "כן" },
  { value: "false", label: "לא" },
];

interface SearchFiltersBarExtendedProps extends SearchFiltersBarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SearchFiltersBar: React.FC<SearchFiltersBarExtendedProps> = ({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onToggle,
}) => {
  const advancedCount =
    [filters.client_name, filters.id_number, filters.binder_number, filters.work_state, filters.has_signals]
      .filter(Boolean).length + filters.signal_type.length;

  const toggleSignal = (value: string) => {
    const next = filters.signal_type.includes(value)
      ? filters.signal_type.filter((s) => s !== value)
      : [...filters.signal_type, value];
    onFilterChange("signal_type", next);
  };

  return (
    <div>
      {/* Toggle row */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
        פילטרים מתקדמים
        {advancedCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-semibold text-white">
            {advancedCount}
          </span>
        )}
        {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {/* Collapsible panel */}
      {isOpen && (
        <div className="mt-3 space-y-4 border-t border-gray-100 pt-4">
          {/* Text filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

          {/* Status filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="מצב עבודה"
              value={filters.work_state}
              onChange={(e) => onFilterChange("work_state", e.target.value)}
              options={WORK_STATE_OPTIONS}
            />
            <Select
              label="יש אותות"
              value={filters.has_signals}
              onChange={(e) => onFilterChange("has_signals", e.target.value)}
              options={HAS_SIGNALS_OPTIONS}
            />
          </div>

          {/* Signal chips */}
          <div className="flex flex-wrap gap-2">
            {SIGNAL_TYPE_OPTIONS.map(({ value }) => {
              const active = filters.signal_type.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleSignal(value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
                    active
                      ? cn(SIGNAL_CHIP_ACTIVE[value] ?? "bg-gray-200 border-gray-500 text-gray-700", "ring-1 ring-offset-1")
                      : (SIGNAL_CHIP_STYLES[value] ?? "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"),
                  )}
                >
                  {getSignalLabel(value)}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          {advancedCount > 0 && onReset && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="text-xs text-gray-500">{advancedCount} פילטרים פעילים</span>
              <Button type="button" variant="ghost" size="sm" onClick={onReset} className="gap-1.5 text-xs">
                <RotateCcw className="h-3.5 w-3.5" />
                איפוס הכל
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
