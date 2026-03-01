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
    <Select
      label="גודל עמוד"
      value={String(filters.page_size)}
      onChange={(e) => onFilterChange("page_size", e.target.value)}
    >
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </Select>
  </div>
);
