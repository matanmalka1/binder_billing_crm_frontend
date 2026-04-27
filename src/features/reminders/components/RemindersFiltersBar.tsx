import { Search, X } from "lucide-react";
import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { ToolbarContainer } from "../../../components/ui/layout/ToolbarContainer";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import {
  reminderTypeLabels,
  statusLabels,
  type ReminderStatus,
  type ReminderType,
} from "../types";
import {
  DEFAULT_REMINDER_STATUS_FILTER,
  REMINDER_STATUS_OPTIONS,
  REMINDER_TYPE_OPTIONS,
} from "../constants";

interface RemindersFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  hasFilters: boolean;
  onClear: () => void;
}

export const RemindersFiltersBar: React.FC<RemindersFiltersBarProps> = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  hasFilters,
  onClear,
}) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(search, onSearchChange);

  const handleClear = () => {
    setSearchDraft("");
    onClear();
  };

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Input
            label="חיפוש"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="שם, עסק, ת.ז. / ח.פ או הודעה..."
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
          <Select
            label="סוג תזכורת"
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            options={REMINDER_TYPE_OPTIONS}
          />
          <Select
            label="סטטוס"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            options={REMINDER_STATUS_OPTIONS}
          />
        </div>
        {hasFilters && (
          <ActiveFilterBadges
            badges={[
              search
                ? {
                    key: "search",
                    label: `חיפוש: ${search}`,
                    onRemove: () => {
                      setSearchDraft("");
                      onSearchChange("");
                    },
                  }
                : null,
              typeFilter
                ? {
                    key: "typeFilter",
                    label: `סוג: ${reminderTypeLabels[typeFilter as ReminderType] ?? typeFilter}`,
                    onRemove: () => onTypeChange(""),
                  }
                : null,
              statusFilter !== DEFAULT_REMINDER_STATUS_FILTER
                ? {
                    key: "statusFilter",
                    label: `סטטוס: ${
                      statusFilter
                        ? statusLabels[statusFilter as ReminderStatus] ?? statusFilter
                        : "כל הסטטוסים"
                    }`,
                    onRemove: () => onStatusChange(DEFAULT_REMINDER_STATUS_FILTER),
                  }
                : null,
            ].filter((badge): badge is NonNullable<typeof badge> => badge !== null)}
            onReset={handleClear}
          />
        )}
      </div>
    </ToolbarContainer>
  );
};
