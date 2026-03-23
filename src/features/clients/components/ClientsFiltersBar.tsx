import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { ActiveFilterBadges } from "../../../components/ui/ActiveFilterBadges";
import type { ClientsFiltersBarProps } from "../types";

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
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <Input
          label="חיפוש לקוח"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="שם, ת.ז. / ח.פ."
          startIcon={<Search className="h-4 w-4" />}
        />
      </div>

      <ActiveFilterBadges
        badges={[
          filters.search ? { key: "search", label: `חיפוש: ${filters.search}`, onRemove: () => { setSearchDraft(""); onFilterChange("search", ""); } } : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleReset}
      />
    </div>
  );
};
