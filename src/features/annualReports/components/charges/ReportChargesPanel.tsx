import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '../../../../components/ui/primitives/Button'
import { getChargeStatusLabel } from '../../../../utils/enums'
import { annualReportChargesApi, annualReportsQK } from '../../api'
import { PAGE_SIZE_SM } from '@/constants/pagination.constants'
import { formatCurrencyILS as fmt } from '@/utils/utils'
import {
  formatChargeCreatedAt,
  getReportChargesTotalPages,
  REPORT_CHARGES_TABLE_HEADERS,
  REPORT_CHARGES_TEXT,
} from './ReportChargesPanel.helpers'

interface Props {
  reportId: number
}

export const ReportChargesPanel: React.FC<Props> = ({ reportId }) => {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: annualReportsQK.reportCharges(reportId, page, PAGE_SIZE_SM),
    queryFn: () => annualReportChargesApi.listCharges(reportId, page, PAGE_SIZE_SM),
    enabled: !!reportId,
  })

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-gray-400">{REPORT_CHARGES_TEXT.loading}</p>
  }

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = getReportChargesTotalPages(total)

  if (items.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-400">{REPORT_CHARGES_TEXT.empty}</p>
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{REPORT_CHARGES_TEXT.total(total)}</p>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              {REPORT_CHARGES_TABLE_HEADERS.map((header) => (
                <th key={header} className="px-4 py-3 text-right">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((charge) => (
              <tr key={charge.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">
                  {charge.description ?? REPORT_CHARGES_TEXT.missingDescription}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{fmt(charge.amount)}</td>
                <td className="px-4 py-3 text-gray-600">{getChargeStatusLabel(charge.status)}</td>
                <td className="px-4 py-3 text-gray-500">
                  {formatChargeCreatedAt(charge.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {REPORT_CHARGES_TEXT.previous}
          </Button>
          <span className="text-gray-500">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            {REPORT_CHARGES_TEXT.next}
          </Button>
        </div>
      )}
    </div>
  )
}

ReportChargesPanel.displayName = 'ReportChargesPanel'
