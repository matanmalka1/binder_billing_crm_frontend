import { useQuery } from '@tanstack/react-query'
import { annualReportTaxApi, annualReportsQK } from '../../api'
import { semanticMonoToneClasses } from '@/utils/semanticColors'
import { formatCurrencyILS } from '@/utils/utils'
import { formatAbsCurrency } from './helpers'

interface Props {
  reportId: number
}

const BALANCE_STYLES = {
  due: { label: 'עוד לתשלום', className: `${semanticMonoToneClasses.negative} font-semibold` },
  refund: { label: 'החזר מס', className: `${semanticMonoToneClasses.positive} font-semibold` },
  zero: { label: 'מאוזן', className: 'text-gray-500 font-semibold' },
}

export const FinalBalancePanel: React.FC<Props> = ({ reportId }) => {
  const taxQuery = useQuery({
    queryKey: annualReportsQK.taxCalc(reportId),
    queryFn: () => annualReportTaxApi.getTaxCalculation(reportId),
    enabled: !!reportId,
  })

  const advancesQuery = useQuery({
    queryKey: annualReportsQK.advancesSummary(reportId),
    queryFn: () => annualReportTaxApi.getAdvancesSummary(reportId),
    enabled: !!reportId,
  })

  if (taxQuery.isLoading || advancesQuery.isLoading)
    return <p className="text-sm text-gray-400">טוען נתונים...</p>

  if (taxQuery.isError || advancesQuery.isError || !taxQuery.data || !advancesQuery.data)
    return <p className="text-sm text-negative-500">שגיאה בטעינת יתרה סופית</p>

  const tax = taxQuery.data
  const adv = advancesQuery.data
  const style = BALANCE_STYLES[adv.balance_type]

  return (
    <div className="space-y-2">
      <dl className="divide-y divide-gray-100">
        <div className="flex justify-between py-1.5 text-sm">
          <dt className="text-gray-500">חבות מס</dt>
          <dd className="font-medium text-gray-900">{formatCurrencyILS(tax.tax_after_credits)}</dd>
        </div>
        <div className="flex justify-between py-1.5 text-sm">
          <dt className="text-gray-500">סה"כ מקדמות ששולמו ({adv.advances_count})</dt>
          <dd className="font-medium text-gray-900">
            {formatCurrencyILS(adv.total_advances_paid)}
          </dd>
        </div>
        <div className="flex justify-between py-1.5 text-sm">
          <dt className="text-gray-500">יתרה סופית</dt>
          <dd className={style.className}>
            {formatAbsCurrency(adv.final_balance)} — {style.label}
          </dd>
        </div>
      </dl>
    </div>
  )
}
