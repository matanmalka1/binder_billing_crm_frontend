import { useEffect, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/utils";
import type { ClientsFiltersBarProps } from "../types";

const STATUS_OPTIONS = [
  { value: "", label: "הכל" },
  { value: "active", label: "פעיל" },
  { value: "frozen", label: "מוקפא" },
  { value: "closed", label: "סגור" },
];

export const ClientsFiltersBar: React.FC<ClientsFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const [debouncedSearch] = useDebounce(searchDraft, 350);

  useEffect(() => {
    setSearchDraft(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange("search", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const hasActive = Boolean(filters.search || filters.status);

  const handleReset = () => {
    setSearchDraft("");
    onFilterChange("search", "");
    onFilterChange("status", "");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <Input
          label="חיפוש לקוח"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="שם, ת.ז. / ח.פ."
          startIcon={<Search className="h-4 w-4" />}
        />
        <Select
          label="סטטוס לקוח"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={STATUS_OPTIONS}
          className={cn(filters.status && "border-primary-400 ring-1 ring-primary-200")}
        />
      </div>

      {hasActive && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          {filters.search && (
            <Badge removable onRemove={() => { setSearchDraft(""); onFilterChange("search", ""); }}>
              {`חיפוש: ${filters.search}`}
            </Badge>
          )}
          {filters.status && (
            <Badge removable onRemove={() => onFilterChange("status", "")}>
              {STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status}
            </Badge>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            איפוס
          </Button>
        </div>
      )}
    </div>
  );
};
