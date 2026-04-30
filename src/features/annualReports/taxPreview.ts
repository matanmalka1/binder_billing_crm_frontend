/**
 * Client-side tax preview used in the CreateReportModal.
 *
 * IMPORTANT: These brackets must be kept in sync with backend/app/annual_reports/services/tax_engine.py.
 * When the backend adds a new tax year, update TAX_BRACKETS_BY_YEAR here as well.
 */

interface TaxBracket {
  limit: number
  rate: number
}

const TAX_BRACKETS_2024: TaxBracket[] = [
  { limit: 81_480, rate: 0.1 },
  { limit: 116_760, rate: 0.14 },
  { limit: 187_800, rate: 0.2 },
  { limit: 261_360, rate: 0.31 },
  { limit: 542_160, rate: 0.35 },
  { limit: 698_280, rate: 0.47 },
  { limit: Infinity, rate: 0.5 },
]

const CREDIT_POINT_VALUE_BY_YEAR: Record<number, number> = {
  2024: 2_904,
}

const DEFAULT_BRACKETS = TAX_BRACKETS_2024
const DEFAULT_CREDIT_POINT_VALUE = 2_904

const getBrackets = (_taxYear: number): TaxBracket[] => {
  // Extend this map as the backend adds new-year bracket tables.
  return DEFAULT_BRACKETS
}

const getCreditPointValue = (taxYear: number): number => {
  return CREDIT_POINT_VALUE_BY_YEAR[taxYear] ?? DEFAULT_CREDIT_POINT_VALUE
}

export const computeTaxPreview = (
  grossIncome: number,
  expenses: number,
  advancesPaid: number,
  creditPoints: number,
  taxYear: number,
): { netProfit: number; estimatedTax: number; balance: number } => {
  const brackets = getBrackets(taxYear)
  const creditPointValue = getCreditPointValue(taxYear)
  const netProfit = grossIncome - expenses

  let tax = 0
  let prev = 0
  for (const { limit, rate } of brackets) {
    if (netProfit <= prev) break
    tax += (Math.min(netProfit, limit) - prev) * rate
    prev = limit
  }
  const grossTax = Math.max(0, tax)
  const creditReduction = creditPoints * creditPointValue
  const estimatedTax = Math.max(0, grossTax - creditReduction)
  const balance = estimatedTax - advancesPaid

  return { netProfit, estimatedTax, balance }
}
