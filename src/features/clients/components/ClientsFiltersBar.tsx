import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import {
  CLIENT_STATUSES,
  CLIENT_STATUS_LABELS,
} from "../constants";
import type { ClientsFiltersBarProps } from "../types";

const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  ...CLIENT_STATUSES.map((s) => ({ value: s, label: CLIENT_STATUS_LABELS[s] })),
];

const SORT_BY_OPTIONS = [
  { value: "full_name", label: "שם לקוח" },
  { value: "created_at", label: "תאריך יצירה" },
  { value: "status", label: "סטטוס" },
];

const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "סדר עולה" },
  { value: "desc", label: "סדר יורד" },
];

export const ClientsFiltersBar: React.FC<ClientsFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(
    filters.search,
    (v) => onFilterChange("search", v),
  );

  const handleReset = () => {
    setSearchDraft("");
    onFilterChange("search", "");
    onFilterChange("status", "");
    onFilterChange("sort_by", "full_name");
    onFilterChange("sort_order", "asc");
  };

  const activeStatus = filters.status ?? "";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          label="חיפוש לקוח"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="שם, ת.ז. / ח.פ."
          startIcon={<Search className="h-4 w-4" />}
        />
        <Select
          label="סטטוס"
          value={activeStatus}
          onChange={(e) => onFilterChange("status", e.target.value)}
          options={STATUS_OPTIONS}
        />
        <Select
          label="מיון לפי"
          value={filters.sort_by}
          onChange={(e) => onFilterChange("sort_by", e.target.value)}
          options={SORT_BY_OPTIONS}
        />
        <Select
          label="כיוון מיון"
          value={filters.sort_order}
          onChange={(e) => onFilterChange("sort_order", e.target.value)}
          options={SORT_ORDER_OPTIONS}
        />
      </div>

      <ActiveFilterBadges
        badges={[
          filters.search
            ? { key: "search", label: `חיפוש: ${filters.search}`, onRemove: () => { setSearchDraft(""); onFilterChange("search", ""); } }
            : null,
          activeStatus
            ? { key: "status", label: `סטטוס: ${CLIENT_STATUS_LABELS[activeStatus as keyof typeof CLIENT_STATUS_LABELS]}`, onRemove: () => onFilterChange("status", "") }
            : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleReset}
      />
    </div>
  );
};
