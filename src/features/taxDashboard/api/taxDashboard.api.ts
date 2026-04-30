import { api } from '@/api/client'
import { DASHBOARD_ENDPOINTS } from '@/features/dashboard'
import type { TaxSubmissionWidgetResponse } from './contracts'

export const taxDashboardApi = {
  getTaxSubmissionsWidget: async (taxYear?: number): Promise<TaxSubmissionWidgetResponse> => {
    const response = await api.get<TaxSubmissionWidgetResponse>(
      DASHBOARD_ENDPOINTS.dashboardTaxSubmissions,
      { params: taxYear ? { tax_year: taxYear } : undefined },
    )
    return response.data
  },
}
