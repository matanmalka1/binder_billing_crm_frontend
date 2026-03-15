import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Select } from "../../../components/ui/Select";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
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

  const hasActive = Boolean(filters.client_id || filters.status || filters.charge_type);

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

      {hasActive && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          {selectedClient && (
            <Badge removable onRemove={handleClearClient}>{`לקוח: ${selectedClient.name}`}</Badge>
          )}
          {filters.status && (
            <Badge removable onRemove={() => onFilterChange("status", "")}>
              {STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status}
            </Badge>
          )}
          {filters.charge_type && (
            <Badge removable onRemove={() => onFilterChange("charge_type", "")}>
              {CHARGE_TYPE_OPTIONS.find((o) => o.value === filters.charge_type)?.label ?? filters.charge_type}
            </Badge>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            איפוס
          </Button>
        </div>
      )}
    </div>
  );
};

ChargesFiltersCard.displayName = "ChargesFiltersCard";
