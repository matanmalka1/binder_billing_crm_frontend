import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import type { ClientsFiltersBarProps } from "../types";

export const ClientsFiltersBar: React.FC<ClientsFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const [debouncedSearch] = useDebounce(searchDraft, 350);

  // Sync draft when URL resets externally
  useEffect(() => {
    setSearchDraft(filters.search);
  }, [filters.search]);

  // Propagate debounced value
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange("search", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <Input
        label="חיפוש לקוח"
        value={searchDraft}
        onChange={(e) => setSearchDraft(e.target.value)}
        placeholder="שם, ת.ז. / ח.פ."
        leftIcon={<Search className="h-4 w-4" />}
      />

      <Select
        label="אותות תפעוליים"
        value={filters.has_signals}
        onChange={(e) => onFilterChange("has_signals", e.target.value)}
      >
        <option value="">הכל</option>
        <option value="true">עם אותות</option>
        <option value="false">ללא אותות</option>
      </Select>

      <Select
        label="סטטוס לקוח"
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
      >
        <option value="">הכל</option>
        <option value="active">פעיל</option>
        <option value="frozen">מוקפא</option>
        <option value="closed">סגור</option>
      </Select>

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
};