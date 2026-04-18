import { useState, useEffect } from "react";
import { ToolbarContainer } from "../../../../components/ui/layout/ToolbarContainer";
import { Select } from "../../../../components/ui/inputs/Select";
import { ActiveFilterBadges } from "../../../../components/ui/table/ActiveFilterBadges";
import { ClientSearchInput, SelectedClientDisplay } from "@/components/shared/client";
import { STATUS_LABELS } from "../../api/utils";
import type { AnnualReportStatus } from "../../api/contracts";
import { cn, YEAR_OPTIONS } from "../../../../utils/utils";

export interface AnnualReportsFilters {
  client_id: string;
  client_name: string;
  status: string;
  year: string;
}

interface AnnualReportsFiltersBarProps {
  filters: AnnualReportsFilters;
  onFilterChange: (key: keyof AnnualReportsFilters, value: string) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  ...(Object.entries(STATUS_LABELS) as [AnnualReportStatus, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

const YEAR_FILTER_OPTIONS = [
  { value: "", label: "כל השנים" },
  ...YEAR_OPTIONS,
];

export const AnnualReportsFiltersBar: React.FC<AnnualReportsFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [clientQuery, setClientQuery] = useState("");
  const selectedClient = filters.client_id
    ? { id: Number(filters.client_id), name: filters.client_name }
    : null;

  // Sync local query when filters reset externally
  useEffect(() => {
    if (!filters.client_id) setClientQuery("");
  }, [filters.client_id]);

  const handleSelectClient = (client: { id: number; name: string }) => {
    setClientQuery(client.name);
    onFilterChange("client_id", String(client.id));
    onFilterChange("client_name", client.name);
  };

  const handleClearClient = () => {
    onFilterChange("client_id", "");
    onFilterChange("client_name", "");
  };

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            {selectedClient ? (
              <SelectedClientDisplay
                name={selectedClient.name}
                id={selectedClient.id}
                onClear={handleClearClient}
                label="לקוח"
              />
            ) : (
              <ClientSearchInput
                label="לקוח"
                value={clientQuery}
                onChange={setClientQuery}
                onSelect={handleSelectClient}
                placeholder="שם, ת.ז. / ח.פ..."
              />
            )}
          </div>
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            options={STATUS_OPTIONS}
            className={cn(filters.status && "border-primary-400 ring-1 ring-primary-200")}
          />
          <Select
            label="שנת מס"
            value={filters.year}
            onChange={(e) => onFilterChange("year", e.target.value)}
            options={YEAR_FILTER_OPTIONS}
            className={cn(filters.year && "border-primary-400 ring-1 ring-primary-200")}
          />
        </div>

        <ActiveFilterBadges
          badges={[
            filters.status
              ? {
                  key: "status",
                  label: STATUS_LABELS[filters.status as AnnualReportStatus] ?? filters.status,
                  onRemove: () => onFilterChange("status", ""),
                }
              : null,
            filters.year
              ? {
                  key: "year",
                  label: `שנת מס: ${filters.year}`,
                  onRemove: () => onFilterChange("year", ""),
                }
              : null,
          ].filter((b): b is NonNullable<typeof b> => b !== null)}
          onReset={onReset}
        />
      </div>
    </ToolbarContainer>
  );
};

AnnualReportsFiltersBar.displayName = "AnnualReportsFiltersBar";
