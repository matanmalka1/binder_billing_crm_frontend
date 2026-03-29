import type { ChangeEvent } from "react";
import { Select } from "../../../components/ui/Select";
import {
  buildBimonthlyPeriodOptions,
  buildMonthlyPeriodOptions,
} from "./periodOptions";

interface VatPeriodFieldProps {
  vatType: "monthly" | "bimonthly";
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const VatPeriodField: React.FC<VatPeriodFieldProps> = ({
  vatType,
  value,
  onChange,
  error,
}) => {
  const options = vatType === "bimonthly"
    ? buildBimonthlyPeriodOptions(6)
    : buildMonthlyPeriodOptions(6);

  const selectOptions = [
    { value: "", label: "בחר תקופה..." },
    ...options,
  ];

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <Select
      label="תקופת מע״מ"
      error={error}
      value={value}
      onChange={handleChange}
      options={selectOptions}
    />
  );
};

VatPeriodField.displayName = "VatPeriodField";
