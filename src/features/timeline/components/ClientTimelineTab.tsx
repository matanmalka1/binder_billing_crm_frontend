import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import {
  Search,
  RefreshCw,
  Activity,
  Filter,
  Zap,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import { ConfirmDialog } from "../../actions/components/ConfirmDialog";
import { TimelineCard } from "./TimelineCard";
import { useClientTimelinePage } from "../hooks/useClientTimelinePage";
import { Button } from "../../../components/ui/Button";
import { PaginationCard } from "../../../components/ui/PaginationCard";
import { Select } from "../../../components/ui/Select";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { getEventTypeLabel, getEventColor } from "./timelineEventMeta";
import { cn } from "../../../utils/utils";

interface ClientTimelineTabProps {
  clientId: string;
}

interface StatPillProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: "blue" | "purple" | "orange" | "neutral";
}

const colorMap: Record<StatPillProps["color"], string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100",
  neutral: "bg-gray-50 text-gray-600 border-gray-200",
};

const StatPill: React.FC<StatPillProps> = ({ icon, value, label, color }) => (
  <div
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
      colorMap[color],
    )}
  >
    {icon}
    <span className="font-bold">{value.toLocaleString("he-IL")}</span>
    <span className="opacity-70">{label}</span>
  </div>
);

export const ClientTimelineTab: React.FC<ClientTimelineTabProps> = ({ clientId }) => {
  const {
    activeActionKey,
    error,
    events,
    filteredEvents,
    filters,
    eventTypeStats,
    summary,
    refresh,
    refreshing,
    handleAction,
    loading,
    page,
    pageSize,
    pendingAction,
    cancelPendingAction,
    confirmPendingAction,
    setPage,
    setPageSize,
    total,
  } = useClientTimelinePage(clientId);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const filterTypes = (() => {
    const rawTypes =
      eventTypeStats.length > 0
        ? eventTypeStats.map((item) => item.type)
        : ["binder_received", "binder_returned", "charge_created", "notification"];

    const uniqueByLabel = new Map<string, { type: string; label: string; count: number }>();
    rawTypes.forEach((type) => {
      const label = getEventTypeLabel(type);
      if (!uniqueByLabel.has(label)) {
        const stat = eventTypeStats.find((s) => s.type === type);
        uniqueByLabel.set(label, { type, label, count: stat?.count ?? 0 });
      }
    });
    return Array.from(uniqueByLabel.values());
  })();

  const activeFilterCount = filters.typeFilters.length + (filters.searchTerm ? 1 : 0);

  const lastUpdated = summary.lastEventTimestamp
    ? format(parseISO(summary.lastEventTimestamp), "d MMM HH:mm", { locale: he })
    : null;

  return (
    <div className="space-y-5">
      {/* ── Command Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/60 bg-white/95 px-5 py-3.5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <StatPill
            icon={<Activity className="h-3.5 w-3.5" />}
            value={total}
            label="אירועים"
            color="blue"
          />
          <StatPill
            icon={<Filter className="h-3.5 w-3.5" />}
            value={filteredEvents.length}
            label="מסוננים"
            color={activeFilterCount > 0 ? "purple" : "neutral"}
          />
          <StatPill
            icon={<Zap className="h-3.5 w-3.5" />}
            value={summary.filteredAvailableActions}
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
            onClick={refresh}
            isLoading={refreshing}
            className="gap-1.5 text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            ריענון
          </Button>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <div className="rounded-2xl border border-gray-200/60 bg-white/95 shadow-sm backdrop-blur-sm overflow-hidden">
        <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center border-b border-gray-100">
          <div className="flex-1 relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={filters.searchTerm}
              onChange={(e) => filters.setSearchTerm(e.target.value)}
              placeholder="חיפוש לפי תיאור, מספר קלסר או חיוב..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {filters.searchTerm && (
              <button
                onClick={() => filters.setSearchTerm("")}
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
                onChange={(e) => setPageSize(e.target.value)}
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

        <div className="flex flex-wrap items-center gap-2 px-5 py-3">
          <span className="text-xs font-medium text-gray-500 ml-1">סנן לפי סוג:</span>
          {filterTypes.map(({ type, label, count }) => {
            const isActive = filters.typeFilters.includes(type);
            const colors = getEventColor(type);
            return (
              <button
                key={label}
                onClick={() => filters.toggleTypeFilter(type)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 border",
                  isActive
                    ? `${colors.chipActiveBg} ${colors.chipActiveText} ${colors.chipActiveBorder} shadow-sm`
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

          {activeFilterCount > 0 && (
            <button
              onClick={filters.clearFilters}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
            >
              <X className="h-3 w-3" />
              נקה מסננים
            </button>
          )}
        </div>
      </div>

      {error && <ErrorCard message={error} />}

      {loading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full animate-loading-bar bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400" />
        </div>
      )}

      <TimelineCard
        events={filteredEvents}
        activeActionKey={activeActionKey}
        onAction={handleAction}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-xl border border-gray-200/60 bg-white/80 px-5 py-3 shadow-sm">
        <p className="text-sm text-gray-500">
          מציג{" "}
          <span className="font-semibold text-gray-800">{filteredEvents.length}</span>
          {" "}מתוך{" "}
          <span className="font-semibold text-gray-800">{events.length}</span>
          {" "}אירועים בעמוד
        </p>
        <PaginationCard
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={setPage}
          showPageSizeSelect={false}
          label="אירועים"
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.confirm?.title || "אישור פעולה"}
        message={pendingAction?.confirm?.message || "האם להמשיך בביצוע הפעולה?"}
        confirmLabel={pendingAction?.confirm?.confirmLabel || "אישור"}
        cancelLabel={pendingAction?.confirm?.cancelLabel || "ביטול"}
        isLoading={activeActionKey === pendingAction?.uiKey}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />
    </div>
  );
};
