import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import type { ClientsFiltersBarProps } from "../types";

export const ClientsFiltersBar: React.FC<ClientsFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local draft in sync when URL changes externally (e.g. reset)
  useEffect(() => {
    setSearchDraft(filters.search);
  }, [filters.search]);

  const handleSearchChange = (value: string) => {
    setSearchDraft(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange("search", value);
    }, 350);
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <Input
        label="חיפוש לקוח"
        value={searchDraft}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="שם, ת.ז. / ח.פ."
        leftIcon={<Search className="h-4 w-4" />}
      />

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
        value={String(filters.page_size)}
        onChange={(event) => onFilterChange("page_size", event.target.value)}
      >
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </Select>
    </div>
  );
};
