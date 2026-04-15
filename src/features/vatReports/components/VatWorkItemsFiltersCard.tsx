import { useMemo, useState } from "react";
import { SelectDropdown } from "../../../components/ui/inputs/SelectDropdown";
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
  const [clientQuery, setClientQuery] = useState(filters.clientSearch);
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

  const handleSelectClient = (client: { id: number; name: string }) => {
    setSelectedClient(client);
    setClientQuery(client.name);
    onFilterChange("clientSearch", String(client.id));
  };

  const handleClientQueryChange = (query: string) => {
    setClientQuery(query);
    if (selectedClient) setSelectedClient(null);
    onFilterChange("clientSearch", query);
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    setClientQuery("");
    onFilterChange("clientSearch", "");
  };

  const handleReset = () => {
    setClientQuery("");
    setSelectedClient(null);
    onClear();
  };

  return (
    <ToolbarContainer>
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {selectedClient ? (
            <SelectedClientDisplay
              name={selectedClient.name}
              id={selectedClient.id}
              onClear={handleClearClient}
              label="חיפוש לקוח"
            />
          ) : (
            <ClientSearchInput
              label="חיפוש לקוח"
              placeholder='שם / ת"ז / ח.פ / מספר לקוח'
              value={clientQuery}
              onChange={handleClientQueryChange}
              onSelect={handleSelectClient}
            />
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תקופה
            </label>
            <SelectDropdown
              value={filters.period}
              onChange={(e) => onFilterChange("period", e.target.value)}
              options={periodOptions}
              className={cn(
                filters.period && "border-primary-400 ring-1 ring-primary-200",
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סטטוס
            </label>
            <SelectDropdown
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              options={VAT_WORK_ITEMS_STATUS_OPTIONS}
              className={cn(
                filters.status && "border-primary-400 ring-1 ring-primary-200",
              )}
            />
          </div>
        </div>

        <ActiveFilterBadges
          badges={[
            filters.status
              ? {
                  key: "status",
                  label:
                    VAT_WORK_ITEMS_STATUS_OPTIONS.find(
                      (o) => o.value === filters.status,
                    )?.label ?? filters.status,
                  onRemove: () => onFilterChange("status", ""),
                }
              : null,
            filters.period
              ? {
                  key: "period",
                  label: `תקופה: ${
                    periodOptions.find((o) => o.value === filters.period)?.label ?? filters.period
                  }`,
                  onRemove: () => onFilterChange("period", ""),
                }
              : null,
          ].filter((b): b is NonNullable<typeof b> => b !== null)}
          onReset={handleReset}
        />
      </div>
    </ToolbarContainer>
  );
};

VatWorkItemsFiltersCard.displayName = "VatWorkItemsFiltersCard";
