import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { SearchFiltersBarProps } from "../types";
import {
  PAGE_SIZE_OPTIONS,
  SIGNAL_TYPE_OPTIONS,
  SLA_STATE_OPTIONS,
  WORK_STATE_OPTIONS,
} from "../../../constants/filterOptions.constants";

export const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="space-y-3">
        <Input
          label="חיפוש חופשי"
          type="text"
          value={filters.query}
          onChange={(event) => onFilterChange("query", event.target.value)}
          placeholder="שם לקוח / מספר תיק"
        />
        <Input
          label="שם לקוח"
          type="text"
          value={filters.client_name}
          onChange={(event) => onFilterChange("client_name", event.target.value)}
          placeholder="שם לקוח"
        />
        <Input
          label="ת.ז / ח.פ"
          type="text"
          value={filters.id_number}
          onChange={(event) => onFilterChange("id_number", event.target.value)}
          placeholder="מספר מזהה"
        />
        <Input
          label="מספר תיק"
          type="text"
          value={filters.binder_number}
          onChange={(event) => onFilterChange("binder_number", event.target.value)}
          placeholder="BND-..."
        />
      </div>

      <div className="space-y-3 md:col-span-3">
        <div className="grid gap-3 md:grid-cols-2">
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
        </div>

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
      </div>
    </div>
  );
};
