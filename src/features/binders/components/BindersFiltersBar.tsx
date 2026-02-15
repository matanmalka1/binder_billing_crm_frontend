import { Select } from "../../../components/ui/Select";
import { SLA_STATE_OPTIONS, WORK_STATE_OPTIONS } from "../../../constants/filterOptions.constants";
import type { BindersFiltersBarProps } from "../types";

export const BindersFiltersBar: React.FC<BindersFiltersBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
  );
};
