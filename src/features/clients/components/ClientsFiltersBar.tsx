import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { ActiveFilterBadges } from "../../../components/ui/ActiveFilterBadges";
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

      <ActiveFilterBadges
        badges={[
          filters.search ? { key: "search", label: `חיפוש: ${filters.search}`, onRemove: () => { setSearchDraft(""); onFilterChange("search", ""); } } : null,
          filters.status ? { key: "status", label: STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status, onRemove: () => onFilterChange("status", "") } : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleReset}
      />
    </div>
  );
};
