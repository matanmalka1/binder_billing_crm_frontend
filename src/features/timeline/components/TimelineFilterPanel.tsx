import { Search, ChevronDown, X } from "lucide-react";
import { Select } from "../../../components/ui/Select";
import { getEventTypeLabel, getEventColor } from "./timelineEventMeta";
import { cn } from "../../../utils/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TimelineFilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilters: string[];
  onToggleTypeFilter: (type: string) => void;
  onClearFilters: () => void;
  pageSize: number;
  onPageSizeChange: (value: string) => void;
  eventTypeStats: { type: string; count: number }[];
  hasActiveFilters: boolean;
}

// ── TimelineFilterPanel ───────────────────────────────────────────────────────

export const TimelineFilterPanel: React.FC<TimelineFilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  typeFilters,
  onToggleTypeFilter,
  onClearFilters,
  pageSize,
  onPageSizeChange,
  eventTypeStats,
  hasActiveFilters,
}) => {
  const filterTypes = (() => {
    const seen = new Map<string, { type: string; label: string; count: number }>();
    eventTypeStats.forEach(({ type, count }) => {
      const label = getEventTypeLabel(type);
      if (!seen.has(label)) seen.set(label, { type, label, count });
    });
    return Array.from(seen.values());
  })();

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white/95 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Search + page size */}
      <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center border-b border-gray-100">
        <div className="flex-1 relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="חיפוש לפי תיאור, מספר קלסר או חיוב..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 whitespace-nowrap">שורות בעמוד</span>
          <div className="relative">
            <Select
              value={String(pageSize)}
              onChange={(e) => onPageSizeChange(e.target.value)}
              className="w-24 appearance-none pr-3 pl-7 text-sm"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </Select>
            <ChevronDown className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-3">
        <span className="text-xs font-medium text-gray-500 ml-1">סנן לפי סוג:</span>
        {filterTypes.map(({ type, label, count }) => {
          const isActive = typeFilters.includes(type);
          const colors = getEventColor(type);
          return (
            <button
              key={label}
              onClick={() => onToggleTypeFilter(type)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 border",
                isActive
                  ? cn(colors.chipActiveBg, colors.chipActiveText, colors.chipActiveBorder, "shadow-sm")
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100",
              )}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                    isActive ? "bg-white/50" : "bg-gray-200 text-gray-600",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <X className="h-3 w-3" />
            נקה מסננים
          </button>
        )}
      </div>
    </div>
  );
};

TimelineFilterPanel.displayName = "TimelineFilterPanel";