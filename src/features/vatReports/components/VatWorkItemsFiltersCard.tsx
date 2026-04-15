import { useMemo, useState, useEffect } from "react";
import { Select } from "../../../components/ui/inputs/Select";
import { ActiveFilterBadges } from "../../../components/ui/table/ActiveFilterBadges";
import { ToolbarContainer } from "../../../components/ui/layout/ToolbarContainer";
import { ClientSearchInput, SelectedClientDisplay } from "@/components/shared/client";
import { cn, MONTH_NAMES } from "../../../utils/utils";
import { VAT_WORK_ITEMS_STATUS_OPTIONS } from "../constants";
import type { VatWorkItemsFiltersCardProps } from "../types";

export const VatWorkItemsFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: VatWorkItemsFiltersCardProps) => {
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);

  const periodOptions = useMemo(
    () => [
      { value: "", label: "כל התקופות" },
      ...Array.from({ length: 24 }, (_, i) => {
        const periodDate = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
        return {
          value: `${periodDate.getFullYear()}-${String(periodDate.getMonth() + 1).padStart(2, "0")}`,
          label: `${MONTH_NAMES[periodDate.getMonth()]} ${periodDate.getFullYear()}`,
        };
      }),
    ],
    [],
  );

  // Sync local state when filter is cleared externally
  useEffect(() => {
    if (!filters.clientSearch) {
      setSelectedClient(null);
      setClientQuery("");
    }
  }, [filters.clientSearch]);

  const handleSelectClient = (client: { id: number; name: string }) => {
    setSelectedClient(client);
    setClientQuery(client.name);
    onFilterChange("clientSearch", String(client.id));
  };

  const handleClearClient = () => {
    onFilterChange("clientSearch", "");
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
                placeholder='שם / ת"ז / ח.פ'
                value={clientQuery}
                onChange={setClientQuery}
                onSelect={handleSelectClient}
              />
            )}
          </div>
          <Select
            label="תקופה"
            value={filters.period}
            onChange={(e) => onFilterChange("period", e.target.value)}
            options={periodOptions}
            className={cn(filters.period && "border-primary-400 ring-1 ring-primary-200")}
          />
          <Select
            label="סטטוס"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            options={VAT_WORK_ITEMS_STATUS_OPTIONS}
            className={cn(filters.status && "border-primary-400 ring-1 ring-primary-200")}
          />
        </div>

        <ActiveFilterBadges
          badges={[
            filters.status
              ? {
                  key: "status",
                  label: VAT_WORK_ITEMS_STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status,
                  onRemove: () => onFilterChange("status", ""),
                }
              : null,
            filters.period
              ? {
                  key: "period",
                  label: `תקופה: ${periodOptions.find((o) => o.value === filters.period)?.label ?? filters.period}`,
                  onRemove: () => onFilterChange("period", ""),
                }
              : null,
          ].filter((b): b is NonNullable<typeof b> => b !== null)}
          onReset={onClear}
        />
      </div>
    </ToolbarContainer>
  );
};

VatWorkItemsFiltersCard.displayName = "VatWorkItemsFiltersCard";
