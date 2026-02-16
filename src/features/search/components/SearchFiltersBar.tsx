import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { SearchFiltersBarProps } from "../types";
import {
  getSignalLabel,
  getSlaStateLabel,
  getWorkStateLabel,
} from "../../../utils/enums";

const WORK_STATE_OPTIONS = [
  { value: "", label: "הכל" },
  { value: "waiting_for_work", label: getWorkStateLabel("waiting_for_work") },
  { value: "in_progress", label: getWorkStateLabel("in_progress") },
  { value: "completed", label: getWorkStateLabel("completed") },
];

const SLA_STATE_OPTIONS = [
  { value: "", label: "הכל" },
  { value: "on_track", label: getSlaStateLabel("on_track") },
  { value: "approaching", label: getSlaStateLabel("approaching") },
  { value: "overdue", label: getSlaStateLabel("overdue") },
];

const SIGNAL_TYPE_OPTIONS = [
  { value: "missing_permanent_documents", label: getSignalLabel("missing_permanent_documents") },
  { value: "near_sla", label: getSignalLabel("near_sla") },
  { value: "overdue", label: getSignalLabel("overdue") },
  { value: "ready_for_pickup", label: getSignalLabel("ready_for_pickup") },
  { value: "unpaid_charges", label: getSignalLabel("unpaid_charges") },
  { value: "idle_binder", label: getSignalLabel("idle_binder") },
];

const PAGE_SIZE_OPTIONS = [
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

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
          placeholder="שם לקוח / מספר קלסר"
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
          label="מספר קלסר"
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
