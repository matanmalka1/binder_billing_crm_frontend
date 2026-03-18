import type { ChangeEvent } from "react";
import { Select } from "../../../components/ui/Select";

interface VatPeriodOption {
  value: string;
  label: string;
}

interface VatPeriodFieldProps {
  vatType: "monthly" | "bimonthly";
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

const buildMonthlyOptions = (count: number): VatPeriodOption[] => {
  const options: VatPeriodOption[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-based
    const mm = String(month + 1).padStart(2, "0");
    options.push({
      value: `${year}-${mm}`,
      label: `${HEBREW_MONTHS[month]} ${year}`,
    });
  }
  return options;
};

const buildBimonthlyOptions = (count: number): VatPeriodOption[] => {
  const options: VatPeriodOption[] = [];
  const now = new Date();
  // מתחיל מהזוג הנוכחי (חודש זוגי = תחילת זוג)
  let year = now.getFullYear();
  let month = now.getMonth(); // 0-based
  // עגל לתחילת זוג (0,2,4,6,8,10)
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
    if (month < 0) {
      month += 12;
      year -= 1;
    }
  }
  return options;
};

export const VatPeriodField: React.FC<VatPeriodFieldProps> = ({
  vatType,
  value,
  onChange,
  error,
}) => {
  const options = vatType === "bimonthly"
    ? buildBimonthlyOptions(6)
    : buildMonthlyOptions(6);

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
