import type { ChangeEvent } from "react";
import { Select } from "../../../components/ui/Select";

interface PeriodOption {
  value: string;
  label: string;
}

interface ReportingPeriodFieldProps {
  materialType: string;
  vatType: "monthly" | "bimonthly" | "exempt" | null;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

const buildMonthlyOptions = (count: number): PeriodOption[] => {
  const options: PeriodOption[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const mm = String(month + 1).padStart(2, "0");
    options.push({ value: `${year}-${mm}`, label: `${HEBREW_MONTHS[month]} ${year}` });
  }
  return options;
};

const buildBimonthlyOptions = (count: number): PeriodOption[] => {
  const options: PeriodOption[] = [];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  if (month % 2 !== 0) month -= 1;
  for (let i = 0; i < count; i++) {
    const m1 = month;
    const m2 = month + 1;
    const mm1 = String(m1 + 1).padStart(2, "0");
    const mm2 = String(m2 + 1).padStart(2, "0");
    options.push({
      value: `${year}-${mm1}-${mm2}`,
      label: `${HEBREW_MONTHS[m1]}-${HEBREW_MONTHS[m2]} ${year}`,
    });
    month -= 2;
    if (month < 0) { month += 12; year -= 1; }
  }
  return options;
};

const buildYearOptions = (count: number): PeriodOption[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const year = currentYear - i;
    return { value: String(year), label: String(year) };
  });
};

const ANNUAL_TYPES = ["annual_report", "capital_declaration"];

export const ReportingPeriodField: React.FC<ReportingPeriodFieldProps> = ({
  materialType,
  vatType,
  value,
  onChange,
  error,
}) => {
  let label = "תקופת דיווח";
  let options: PeriodOption[];

  if (materialType === "vat") {
    label = 'תקופת מע"מ';
    options = vatType === "bimonthly" ? buildBimonthlyOptions(6) : buildMonthlyOptions(6);
  } else if (ANNUAL_TYPES.includes(materialType)) {
    label = "שנת דיווח";
    options = buildYearOptions(5);
  } else {
    options = buildMonthlyOptions(12);
  }

  const selectOptions = [{ value: "", label: "בחר תקופה..." }, ...options];

  // For annual types: auto-select current year as default if no value set
  const effectiveValue = ANNUAL_TYPES.includes(materialType) && !value
    ? String(new Date().getFullYear())
    : value;

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value);

  return (
    <Select
      label={label}
      error={error}
      value={effectiveValue}
      onChange={handleChange}
      options={selectOptions}
    />
  );
};

ReportingPeriodField.displayName = "ReportingPeriodField";
