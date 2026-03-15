import { useState } from "react";
import { Select } from "../../../components/ui/Select";
import { ActiveFilterBadges } from "../../../components/ui/ActiveFilterBadges";
import { ClientSearchInput, SelectedClientDisplay } from "../../../components/ui/ClientSearchInput";
import { cn } from "../../../utils/utils";
import type { ChargesFilters } from "../types";

interface ChargesFiltersCardProps {
  filters: ChargesFilters;
  onClear: () => void;
  onFilterChange: (key: string, value: string) => void;
}

const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "draft", label: "טיוטה" },
  { value: "issued", label: "הונפק" },
  { value: "paid", label: "שולם" },
  { value: "canceled", label: "בוטל" },
];

const CHARGE_TYPE_OPTIONS = [
  { value: "", label: "כל הסוגים" },
  { value: "one_time", label: "חד פעמי" },
  { value: "retainer", label: "ריטיינר" },
  { value: "hourly", label: "שעתי" },
];

export const ChargesFiltersCard = ({
  filters,
  onClear,
  onFilterChange,
}: ChargesFiltersCardProps) => {
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);

  const handleSelectClient = (client: { id: number; name: string }) => {
    setSelectedClient(client);
    setClientQuery(client.name);
    onFilterChange("client_id", String(client.id));
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    setClientQuery("");
    onFilterChange("client_id", "");
  };

  const handleClearAll = () => {
    handleClearClient();
    onClear();
  };

  return (
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
              placeholder="חפש לקוח..."
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
          label="סוג חיוב"
          value={filters.charge_type}
          onChange={(e) => onFilterChange("charge_type", e.target.value)}
          options={CHARGE_TYPE_OPTIONS}
          className={cn(filters.charge_type && "border-primary-400 ring-1 ring-primary-200")}
        />
      </div>

      <ActiveFilterBadges
        badges={[
          selectedClient ? { key: "client", label: `לקוח: ${selectedClient.name}`, onRemove: handleClearClient } : null,
          filters.status ? { key: "status", label: STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status, onRemove: () => onFilterChange("status", "") } : null,
          filters.charge_type ? { key: "charge_type", label: CHARGE_TYPE_OPTIONS.find((o) => o.value === filters.charge_type)?.label ?? filters.charge_type, onRemove: () => onFilterChange("charge_type", "") } : null,
        ].filter((b): b is NonNullable<typeof b> => b !== null)}
        onReset={handleClearAll}
      />
    </div>
  );
};

ChargesFiltersCard.displayName = "ChargesFiltersCard";
