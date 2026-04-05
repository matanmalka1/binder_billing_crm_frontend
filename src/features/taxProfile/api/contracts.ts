export interface TaxProfileData {
  vat_type: "monthly" | "bimonthly" | "exempt" | null;
  business_type: string | null;
  tax_year_start: number | null;
  accountant_name: string | null;
  advance_rate: string | null;
}

export interface TaxProfileUpdatePayload {
  vat_type?: "monthly" | "bimonthly" | "exempt" | null;
  business_type?: string | null;
  tax_year_start?: number | null;
  accountant_name?: string | null;
  advance_rate?: number | null;
}
