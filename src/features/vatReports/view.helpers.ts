import type { KeyboardEvent } from "react";
import { formatClientOfficeId, getReportingPeriodMonthLabel } from "@/utils/utils";
import { semanticMonoToneClasses } from "@/utils/semanticColors";
import { DEDUCTION_RATES, VAT_DEADLINE_WARNING_DAYS, VAT_NUMERIC_KEYS } from "./constants";
import type { VatPeriodRow, VatWorkItemResponse } from "./api";

export const getDuplicateClientIds = (items: VatWorkItemResponse[]): Set<number> => {
  const counts = new Map<number, number>();
  items.forEach((item) => {
    counts.set(item.client_record_id, (counts.get(item.client_record_id) ?? 0) + 1);
  });
  return new Set([...counts.entries()].filter(([, count]) => count > 1).map(([clientId]) => clientId));
};

export const getVatDeadlineCounts = (items: VatWorkItemResponse[]) =>
  items.reduce(
    (counts, item) => {
      if (item.is_overdue) {
        counts.overdue += 1;
      } else if (
        item.days_until_deadline != null &&
        item.days_until_deadline <= VAT_DEADLINE_WARNING_DAYS
      ) {
        counts.urgent += 1;
      }
      return counts;
    },
    { overdue: 0, urgent: 0 },
  );

export const formatVatPeriodTitle = (period: string, periodType: string | null): string => {
  const [year] = period.split("-");
  const yearNumber = Number(year);
  const monthsCount = periodType === "bimonthly" ? 2 : 1;
  const monthLabel = getReportingPeriodMonthLabel(period, monthsCount).replace("-", "–");
  return Number.isInteger(yearNumber) && monthLabel !== period ? `${monthLabel} ${yearNumber}` : period;
};

export const formatVatPeriodLabel = (period: string, isBimonthly: boolean): string =>
  formatVatPeriodTitle(period, isBimonthly ? "bimonthly" : "monthly");

export const getClientSummaryRowsForYear = (
  rows: VatPeriodRow[] | undefined,
  year: number | undefined,
): VatPeriodRow[] => {
  if (year === undefined) return [];
  return (rows ?? []).filter((row) => row.period.startsWith(String(year)));
};

export const canOpenVatPeriodRow = (row: VatPeriodRow): boolean =>
  Number.isInteger(row.work_item_id) && row.work_item_id > 0;

export const getVatClientTitle = (name: string | null, clientRecordId: number): string =>
  name ?? `לקוח ${formatClientOfficeId(clientRecordId)}`;

export const getNetVatTone = (value: string | number | null | undefined): string =>
  Number(value) >= 0 ? semanticMonoToneClasses.negative : semanticMonoToneClasses.positive;

export const getDeductionRateHint = (
  category: string | undefined,
): { label: string; className: string } | null => {
  if (category === undefined) return null;
  const rate = DEDUCTION_RATES[category];
  if (rate === undefined || rate === 1) return null;
  return {
    label: rate === 0 ? "ניכוי אסור" : `ניכוי ${(rate * 100).toFixed(0)}%`,
    className: rate === 0 ? "text-negative-600" : "text-warning-600",
  };
};

export const shouldRequireCounterpartyId = (invoiceType: "income" | "expense", documentType?: string): boolean =>
  invoiceType === "expense" && documentType === "tax_invoice";

export const blockNonNumericKey = (event: KeyboardEvent, allowDot = false): void => {
  const pattern = allowDot ? /[\d.]/ : /[\d]/;
  if (!pattern.test(event.key) && !VAT_NUMERIC_KEYS.includes(event.key)) event.preventDefault();
};
