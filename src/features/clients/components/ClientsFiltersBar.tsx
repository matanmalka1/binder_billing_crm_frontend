import { Select } from "../../../components/ui/Select";
import type { ClientsFiltersBarProps } from "../types";

export const ClientsFiltersBar: React.FC<ClientsFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Select
        label="אותות תפעוליים"
        value={filters.has_signals}
        onChange={(event) => onFilterChange("has_signals", event.target.value)}
      >
        <option value="">הכל</option>
        <option value="true">עם אותות</option>
        <option value="false">ללא אותות</option>
      </Select>

      <Select
        label="סטטוס לקוח"
        value={filters.status}
        onChange={(event) => onFilterChange("status", event.target.value)}
      >
        <option value="">הכל</option>
        <option value="active">פעיל</option>
        <option value="frozen">מוקפא</option>
        <option value="closed">סגור</option>
      </Select>

      <Select
        label="גודל עמוד"
        value={filters.page_size}
        onChange={(event) => onFilterChange("page_size", event.target.value)}
      >
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </Select>
    </div>
  );
};
