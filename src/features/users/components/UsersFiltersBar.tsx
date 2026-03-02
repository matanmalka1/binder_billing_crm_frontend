import { Select } from "../../../components/ui/Select";
import type { UsersFilters } from "../types";

interface UsersFiltersBarProps {
  filters: UsersFilters;
  onFilterChange: (key: string, value: string) => void;
}

const ACTIVE_OPTIONS = [
  { value: "", label: "כל המשתמשים" },
  { value: "true", label: "פעילים בלבד" },
  { value: "false", label: "לא פעילים" },
];

export const UsersFiltersBar: React.FC<UsersFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
    <Select
      label="סטטוס"
      value={filters.is_active}
      onChange={(e) => onFilterChange("is_active", e.target.value)}
      options={ACTIVE_OPTIONS}
    />
  </div>
);
