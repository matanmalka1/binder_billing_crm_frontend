import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { FilterBar } from "../../../components/ui/FilterBar";
import type { TaxDeadlineFilters } from "../types";

interface Props {
  filters: TaxDeadlineFilters;
  onChange: (key: string, value: string) => void;
}

export const TaxDeadlinesFilters: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <FilterBar>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Input
          label="מזהה לקוח"
          type="number"
          value={filters.client_id}
          onChange={(e) => onChange("client_id", e.target.value)}
          placeholder="#123"
        />
        <Select
          label="סוג מועד"
          value={filters.deadline_type}
          onChange={(e) => onChange("deadline_type", e.target.value)}
        >
          <option value="">הכל</option>
          <option value="vat">מע״מ</option>
          <option value="advance_payment">מקדמות</option>
          <option value="national_insurance">ביטוח לאומי</option>
          <option value="annual_report">דוח שנתי</option>
          <option value="other">אחר</option>
        </Select>
        <Select
          label="סטטוס"
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="">הכל</option>
          <option value="pending">ממתין</option>
          <option value="completed">הושלם</option>
        </Select>
        <Select
          label="גודל עמוד"
          value={String(filters.page_size)}
          onChange={(e) => onChange("page_size", e.target.value)}
        >
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Select>
      </div>
    </FilterBar>
  );
};
