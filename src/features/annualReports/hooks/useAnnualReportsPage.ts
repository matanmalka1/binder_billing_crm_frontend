import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSeasonDashboard } from './useSeasonDashboard'
import type { AnnualReportsFilters } from '../components/shared/AnnualReportsFiltersBar'
import { getActiveReportTaxYear } from '@/constants/periodOptions.constants'

const DEFAULT_FILTERS: AnnualReportsFilters = {
  client_id: '',
  client_name: '',
  status: '',
  year: String(getActiveReportTaxYear()),
}

export const useAnnualReportsPage = () => {
  const [showCreate, setShowCreate] = useState(false)
  const [filters, setFilters] = useState<AnnualReportsFilters>(DEFAULT_FILTERS)
  const navigate = useNavigate()

  const selectedTaxYear = filters.year ? Number(filters.year) : undefined
  const season = useSeasonDashboard(selectedTaxYear)
  const taxYear = season.summary?.tax_year ?? selectedTaxYear
  const filingSeasonYear = season.summary?.filing_season_year

  const openReport = (id: number) =>
    navigate(`/tax/reports/${id}`, { state: { from: '/tax/reports' } })

  const handleFilterChange = (key: keyof AnnualReportsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => setFilters(DEFAULT_FILTERS)

  const filteredReports = useMemo(() => {
    let reports = season.reports
    if (filters.client_id) {
      reports = reports.filter((r) => r.client_record_id === Number(filters.client_id))
    }
    if (filters.status) {
      reports = reports.filter((r) => r.status === filters.status)
    }
    return reports
  }, [season.reports, filters.client_id, filters.status])

  return {
    taxYear,
    filingSeasonYear,
    showCreate,
    openCreate: () => setShowCreate(true),
    closeCreate: () => setShowCreate(false),
    openReport,
    filters,
    handleFilterChange,
    handleResetFilters,
    filteredReports,
    season,
  }
}
