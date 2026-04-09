export interface TaxProfileData {
  id: number;
  entity_type: string | null;
  vat_reporting_frequency: "monthly" | "bimonthly" | "exempt" | null;
  vat_start_date: string | null;
  vat_exempt_ceiling: string | null;
  advance_rate: string | null;
  advance_rate_updated_at: string | null;
  accountant_name: string | null;
  business_type_label: string | null;
  fiscal_year_start_month: number;
  tax_year_start: number | null;
}

export interface TaxProfileUpdatePayload {
  vat_reporting_frequency?: "monthly" | "bimonthly" | "exempt" | null;
  entity_type?: string | null;
  tax_year_start?: number | null;
  accountant_name?: string | null;
  advance_rate?: string | null;
  advance_rate_updated_at?: string | null;
  vat_start_date?: string | null;
  vat_exempt_ceiling?: string | null;
  business_type_label?: string | null;
  fiscal_year_start_month?: number | null;
}
