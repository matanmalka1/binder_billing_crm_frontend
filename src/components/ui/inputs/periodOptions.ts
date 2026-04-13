import { MONTH_NAMES } from "../../../utils/utils";

export interface PeriodOption {
  value: string;
  label: string;
}

export const buildMonthlyPeriodOptions = (count: number): PeriodOption[] => {
  const options: PeriodOption[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();

    options.push({
      value: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: `${MONTH_NAMES[month]} ${year}`,
    });
  }

  return options;
};

export const buildBimonthlyPeriodOptions = (count: number): PeriodOption[] => {
  const options: PeriodOption[] = [];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  if (month % 2 !== 0) {
    month -= 1;
  }

  for (let i = 0; i < count; i++) {
    const firstMonth = month;
    const secondMonth = month + 1;

    options.push({
      value: `${year}-${String(firstMonth + 1).padStart(2, "0")}-${String(secondMonth + 1).padStart(2, "0")}`,
      label: `${MONTH_NAMES[firstMonth]}-${MONTH_NAMES[secondMonth]} ${year}`,
    });

    month -= 2;
    if (month < 0) {
      month += 12;
      year -= 1;
    }
  }

  return options;
};

export const buildYearPeriodOptions = (count: number): PeriodOption[] => {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: count }, (_, index) => {
    const year = currentYear - index;
    return { value: String(year), label: String(year) };
  });
};
