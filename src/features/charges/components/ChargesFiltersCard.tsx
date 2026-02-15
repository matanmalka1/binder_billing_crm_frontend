import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { ChargesFilters } from "../types";

interface ChargesFiltersCardProps {
  filters: ChargesFilters;
  onClear: () => void;
  onFilterChange: (key: string, value: string) => void;
}

export const ChargesFiltersCard: React.FC<ChargesFiltersCardProps> = ({
  filters,
  onClear,
  onFilterChange,
}) => (
  <Card title="סינון">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <Input
        label="מזהה לקוח"
        type="number"
        min={1}
        value={filters.client_id}
        onChange={(event) => onFilterChange("client_id", event.target.value)}
      />
      <Select
        label="סטטוס חיוב"
        value={filters.status}
        onChange={(event) => onFilterChange("status", event.target.value)}
      >
        <option value="">הכל</option>
        <option value="draft">טיוטה</option>
        <option value="issued">הונפק</option>
        <option value="paid">שולם</option>
        <option value="canceled">בוטל</option>
      </Select>
      <Select
        label="גודל עמוד"
        value={String(filters.page_size)}
        onChange={(event) => onFilterChange("page_size", event.target.value)}
      >
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </Select>
      <div className="flex items-end">
        <Button type="button" variant="outline" onClick={onClear}>
          איפוס סינון
        </Button>
      </div>
    </div>
  </Card>
);
