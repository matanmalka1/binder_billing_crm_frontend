import { Search, X } from "lucide-react";
import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { reminderTypeLabels, type ReminderType } from "../types";

const TYPE_OPTIONS = [
  { value: "", label: "כל הסוגים" },
  ...(Object.entries(reminderTypeLabels) as [ReminderType, string][]).map(([value, label]) => ({
    value,
    label,
  })),
];

interface RemindersFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  hasFilters: boolean;
  onClear: () => void;
}

export const RemindersFiltersBar: React.FC<RemindersFiltersBarProps> = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  hasFilters,
  onClear,
}) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(search, onSearchChange);

  const handleClear = () => {
    setSearchDraft("");
    onClear();
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-48">
        <Input
          label="חיפוש לקוח"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="חיפוש לפי שם לקוח..."
          startIcon={<Search className="h-4 w-4" />}
          endElement={
            searchDraft ? (
              <button
                type="button"
                onClick={() => { setSearchDraft(""); onSearchChange(""); }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : undefined
          }
        />
      </div>
      <div className="w-52">
        <Select
          label="סוג תזכורת"
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          options={TYPE_OPTIONS}
        />
      </div>
      {hasFilters && (
        <button
          type="button"
          onClick={handleClear}
          className="mb-0.5 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          נקה סינון
        </button>
      )}
    </div>
  );
};
