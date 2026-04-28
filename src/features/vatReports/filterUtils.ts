import { VAT_PERIOD_TYPES, type VatPeriodTypeFilter } from "./constants";

export const toVatPeriodTypeFilter = (value: string | null): VatPeriodTypeFilter | "" =>
  VAT_PERIOD_TYPES.includes(value as VatPeriodTypeFilter)
    ? (value as VatPeriodTypeFilter)
    : "";

export const toOptionalVatPeriodTypeFilter = (
  value: VatPeriodTypeFilter | "",
): VatPeriodTypeFilter | undefined => value || undefined;
