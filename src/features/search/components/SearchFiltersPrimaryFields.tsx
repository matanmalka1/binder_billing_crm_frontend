import React from "react";
import { Input } from "../../../components/ui/Input";
import type { SearchFiltersPrimaryFieldsProps } from "../types";

export const SearchFiltersPrimaryFields: React.FC<SearchFiltersPrimaryFieldsProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <>
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
    </>
  );
};
