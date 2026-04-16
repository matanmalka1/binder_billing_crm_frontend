import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Select } from "../../../components/ui/inputs/Select";
import { Input } from "../../../components/ui/inputs/Input";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import { StatsCard } from "../../../components/ui/layout/StatsCard";
import { Archive, CheckCircle2, FolderKanban, Search, Undo2, X } from "lucide-react";
import { BINDER_STATUS_OPTIONS } from "../constants";
import type { BindersFiltersBarProps } from "../types";
import { cn, buildYearOptions } from "../../../utils/utils";

const YEAR_OPTIONS = [
  { value: "", label: "כל התקופות" },
  ...buildYearOptions(),
];

export const BindersFiltersBar = ({
  filters,
  counters,
  onFilterChange,
  onReset,
}: BindersFiltersBarProps) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(
    filters.query ?? "",
    (v) => onFilterChange("query", v),
  );

  const handleReset = () => {
    setSearchDraft("");
    onReset();
  };

  const statusPills = [
    {
      key: "",
      label: 'סה"כ קלסרים',
      count: counters.total,
      icon: FolderKanban,
      variant: "blue" as const,
    },
    {
      key: "in_office",
      label: "במשרד",
      count: counters.in_office,
      icon: Archive,
      variant: "orange" as const,
    },
    {
      key: "ready_for_pickup",
      label: "מוכן לאיסוף",
      count: counters.ready_for_pickup,
      icon: CheckCircle2,
      variant: "green" as const,
    },
    {
      key: "returned",
      label: "הוחזר",
      count: counters.returned,
      icon: Undo2,
      variant: "neutral" as const,
    },
  ] as const;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {statusPills.map((pill) => {
          const isActive = (filters.status ?? "") === pill.key;
          return (
            <StatsCard
              key={pill.key || "total"}
              title={pill.label}
              value={pill.count}
              icon={pill.icon}
              variant={pill.variant}
              onClick={() => onFilterChange("status", pill.key)}
              selected={isActive}
              className="h-full w-full text-right"
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label="חיפוש"
          type="text"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="שם לקוח או מספר קלסר..."
          startIcon={<Search className="h-4 w-4" />}
          endElement={
            searchDraft ? (
              <button type="button" onClick={() => { setSearchDraft(""); onFilterChange("query", ""); }} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            ) : undefined
          }
        />
        <Select
          label="סטטוס"
          value={filters.status ?? ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={[...BINDER_STATUS_OPTIONS]}
          className={cn(
            filters.status && "border-primary-400 ring-1 ring-primary-200",
          )}
        />
        <Select
          label="תקופה"
          value={filters.year ?? ""}
          onChange={(e) => onFilterChange("year", e.target.value)}
          options={YEAR_OPTIONS}
          className={cn(
            filters.year && "border-primary-400 ring-1 ring-primary-200",
          )}
        />
      </div>

      <ActiveFilterBadges
        badges={[
          filters.query
            ? {
                key: "query",
                label: `חיפוש: ${filters.query}`,
                onRemove: () => {
                  setSearchDraft("");
                  onFilterChange("query", "");
                },
              }
            : null,
          filters.status
            ? {
                key: "status",
                label:
                  BINDER_STATUS_OPTIONS.find((o) => o.value === filters.status)
                    ?.label ?? filters.status,
                onRemove: () => onFilterChange("status", ""),
              }
            : null,
          filters.year
            ? {
                key: "year",
                label: filters.year,
                onRemove: () => onFilterChange("year", ""),
              }
            : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleReset}
      />
    </div>
  );
};

BindersFiltersBar.displayName = "BindersFiltersBar";
