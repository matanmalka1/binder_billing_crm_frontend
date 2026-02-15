import { Select } from "../../../components/ui/Select";
import {
  PAGE_SIZE_OPTIONS,
  SIGNAL_TYPE_OPTIONS,
  SLA_STATE_OPTIONS,
  WORK_STATE_OPTIONS,
} from "../../../constants/filterOptions.constants";
import type { SearchFiltersStatusFieldsProps } from "../types";

export const SearchFiltersStatusFields: React.FC<SearchFiltersStatusFieldsProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <>
      <Select
        label="מצב עבודה"
        value={filters.work_state}
        onChange={(event) => onFilterChange("work_state", event.target.value)}
        options={WORK_STATE_OPTIONS}
      />
      <Select
        label="מצב SLA"
        value={filters.sla_state}
        onChange={(event) => onFilterChange("sla_state", event.target.value)}
        options={SLA_STATE_OPTIONS}
      />
      <Select
        label="סוג אות (רב-בחירה)"
        multiple
        value={filters.signal_type}
        onChange={(event) =>
          onFilterChange(
            "signal_type",
            Array.from(event.target.selectedOptions).map((option) => option.value),
          )
        }
        className="h-28"
        options={SIGNAL_TYPE_OPTIONS}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="יש אותות"
          value={filters.has_signals}
          onChange={(event) => onFilterChange("has_signals", event.target.value)}
          options={[
            { value: "", label: "הכל" },
            { value: "true", label: "כן" },
            { value: "false", label: "לא" },
          ]}
        />
        <Select
          label="גודל עמוד"
          value={String(filters.page_size)}
          onChange={(event) => onFilterChange("page_size", event.target.value)}
          options={PAGE_SIZE_OPTIONS}
        />
      </div>
    </>
  );
};
