import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { RefreshCw, Activity, Filter, Zap, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type StatPillColor = "blue" | "purple" | "orange" | "neutral";

const STAT_PILL_COLORS: Record<StatPillColor, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
};

// ── StatPill ──────────────────────────────────────────────────────────────────

interface StatPillProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: StatPillColor;
}

const StatPill: React.FC<StatPillProps> = ({ icon, value, label, color }) => (
  <div
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
      STAT_PILL_COLORS[color],
    )}
  >
    {icon}
    <span className="font-bold">{value.toLocaleString("he-IL")}</span>
    <span className="opacity-70">{label}</span>
  </div>
);

StatPill.displayName = "StatPill";

// ── TimelineCommandBar ────────────────────────────────────────────────────────

export interface TimelineCommandBarProps {
  total: number;
  filteredCount: number;
  actionsCount: number;
  hasActiveFilters: boolean;
  lastEventTimestamp: string | null;
  refreshing: boolean;
  onRefresh: () => void;
}

export const TimelineCommandBar: React.FC<TimelineCommandBarProps> = ({
  total,
  filteredCount,
  actionsCount,
  hasActiveFilters,
  lastEventTimestamp,
  refreshing,
  onRefresh,
}) => {
  const lastUpdated = lastEventTimestamp
    ? format(parseISO(lastEventTimestamp), "d MMM HH:mm", { locale: he })
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/60 bg-white/95 px-5 py-3.5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <StatPill
          icon={<Activity className="h-3.5 w-3.5" />}
          value={total}
          label="אירועים"
          color="blue"
        />
        <StatPill
          icon={<Filter className="h-3.5 w-3.5" />}
          value={filteredCount}
          label="מסוננים"
          color={hasActiveFilters ? "purple" : "neutral"}
        />
        <StatPill
          icon={<Zap className="h-3.5 w-3.5" />}
          value={actionsCount}
          label="פעולות"
          color="orange"
        />
      </div>

      <div className="flex items-center gap-3">
        {lastUpdated && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>עדכון: {lastUpdated}</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          isLoading={refreshing}
          className="gap-1.5 text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          ריענון
        </Button>
      </div>
    </div>
  );
};

TimelineCommandBar.displayName = "TimelineCommandBar";