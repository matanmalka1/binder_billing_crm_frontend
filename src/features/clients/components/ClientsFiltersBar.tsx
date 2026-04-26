import { useSearchDebounce } from "../../../hooks/useSearchDebounce";
import { Search, X } from "lucide-react";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { ToolbarContainer } from "../../../components/ui/layout/ToolbarContainer";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import {
  CLIENT_SORT_BY_OPTIONS,
  CLIENT_SORT_ORDER_OPTIONS,
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_OPTIONS,
} from "../constants";
import type { ClientsFiltersBarProps } from "../types";
import { useAdvisorOptions } from "@/features/users";
import { ALL_STATUSES_OPTION } from "@/constants/filterOptions.constants";

const STATUS_OPTIONS = [ALL_STATUSES_OPTION, ...CLIENT_STATUS_OPTIONS];

export const ClientsFiltersBar: React.FC<ClientsFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  showAccountantFilter = false,
}) => {
  const [searchDraft, setSearchDraft] = useSearchDebounce(
    filters.search,
    (v) => onFilterChange("search", v),
  );
  const { options: advisorOptions, nameById } = useAdvisorOptions(showAccountantFilter);

  const handleReset = () => {
    setSearchDraft("");
    onReset();
  };

  const activeStatus = filters.status ?? "";
  const activeAccountantId = filters.accountant_id ? String(filters.accountant_id) : "";

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            label="חיפוש לקוח"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="שם, ת.ז. / ח.פ."
            startIcon={<Search className="h-4 w-4" />}
            endElement={
              searchDraft ? (
                <button type="button" onClick={() => { setSearchDraft(""); onFilterChange("search", ""); }} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : undefined
            }
          />
          <Select
            label="סטטוס"
            value={activeStatus}
            onChange={(e) => onFilterChange("status", e.target.value)}
            options={STATUS_OPTIONS}
          />
          {showAccountantFilter && (
            <Select
              label="רואה חשבון"
              value={activeAccountantId}
              onChange={(e) => onFilterChange("accountant_id", e.target.value)}
              options={[
                { value: "", label: "כל רואי החשבון" },
                ...advisorOptions,
              ]}
            />
          )}
          <Select
            label="מיון לפי"
            value={filters.sort_by}
            onChange={(e) => onFilterChange("sort_by", e.target.value)}
            options={CLIENT_SORT_BY_OPTIONS}
          />
          <Select
            label="כיוון מיון"
            value={filters.sort_order}
            onChange={(e) => onFilterChange("sort_order", e.target.value)}
            options={CLIENT_SORT_ORDER_OPTIONS}
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
            activeAccountantId
              ? {
                  key: "accountant_id",
                  label: `רואה חשבון: ${nameById.get(Number(activeAccountantId)) ?? activeAccountantId}`,
                  onRemove: () => onFilterChange("accountant_id", ""),
                }
              : null,
          ].filter((b): b is NonNullable<typeof b> => b !== null)}
          onReset={handleReset}
        />
      </div>
    </ToolbarContainer>
  );
};
