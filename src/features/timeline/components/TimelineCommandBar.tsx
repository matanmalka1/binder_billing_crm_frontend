import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { RefreshCw, Search, X, ChevronDown, Filter } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { Select } from "../../../components/ui/inputs/Select";
import { getEventColor } from "../constants";
import { getEventTypeLabel } from "../utils";
import { cn } from "../../../utils/utils";

// ── TimelineCommandBar ────────────────────────────────────────────────────────

export interface TimelineCommandBarProps {
  total: number;
  hasActiveFilters: boolean;
  lastEventTimestamp: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilters: string[];
  onToggleTypeFilter: (type: string) => void;
  onClearFilters: () => void;
  pageSize: number;
  onPageSizeChange: (value: string) => void;
  eventTypeStats: { type: string; count: number }[];
}

export const TimelineCommandBar: React.FC<TimelineCommandBarProps> = ({
  total,
  hasActiveFilters,
  lastEventTimestamp,
  refreshing,
  onRefresh,
  searchTerm,
  onSearchChange,
  typeFilters,
  onToggleTypeFilter,
  onClearFilters,
  pageSize,
  onPageSizeChange,
  eventTypeStats,
}) => {
  const lastUpdated = lastEventTimestamp
    ? format(parseISO(lastEventTimestamp), "d MMM HH:mm", { locale: he })
    : null;

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
      {/* Top row: search + page size + refresh */}
      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center border-b border-gray-100">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="חיפוש לפי תיאור, מספר קלסר או חיוב..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
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

        {/* Right controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Total count */}
          <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
            {total.toLocaleString("he-IL")} אירועים
          </span>

          {/* Last updated */}
          {lastUpdated && (
            <span className="hidden md:block text-xs text-gray-400 whitespace-nowrap">
              עדכון: {lastUpdated}
            </span>
          )}

          {/* Page size */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:block">שורות:</span>
            <div className="relative">
              <Select
                value={String(pageSize)}
                onChange={(e) => onPageSizeChange(e.target.value)}
                className="w-20 appearance-none pr-3 pl-7 text-sm"
              >
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </Select>
              <ChevronDown className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={refreshing}
            className="gap-1.5 text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ריענון</span>
          </Button>
        </div>
      </div>

      {/* Bottom row: type filter chips */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 ml-1">
          <Filter className="h-3 w-3" />
          סנן:
        </span>
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
            נקה
          </button>
        )}
      </div>
    </div>
  );
};

TimelineCommandBar.displayName = "TimelineCommandBar";
