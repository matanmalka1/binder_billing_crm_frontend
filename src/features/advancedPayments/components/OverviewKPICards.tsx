import { TrendingUp, Banknote, CheckCircle, Clock } from 'lucide-react'
import { StatsCard } from '../../../components/ui/layout/StatsCard'
import { fmtCurrency } from '../utils'
import { getCollectionPercent } from './advancePaymentComponent.utils'

interface OverviewKPICardsProps {
  year: number
  totalExpected: string | number | null
  totalPaid: string | number | null
  collectionRate: number | null
  overdueCount?: number
}

export const OverviewKPICards: React.FC<OverviewKPICardsProps> = ({
  year,
  totalExpected,
  totalPaid,
  collectionRate,
  overdueCount,
}) => {
  const pct = getCollectionPercent(collectionRate, true)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <StatsCard
        title="סה״כ צפוי"
        value={fmtCurrency(totalExpected)}
        icon={Banknote}
        variant="blue"
        description={`שנת ${year}`}
      />
      <StatsCard
        title="סה״כ שולם"
        value={fmtCurrency(totalPaid)}
        icon={CheckCircle}
        variant="green"
        description="לפי הסינון הנבחר"
      />
      <StatsCard
        title="שיעור גבייה"
        value={pct !== null ? `${pct}%` : '—'}
        icon={TrendingUp}
        variant="purple"
        progress={pct ?? undefined}
      />
      <StatsCard title="באיחור" value={overdueCount != null ? String(overdueCount) : '—'} icon={Clock} variant="red" />
    </div>
  )
}

OverviewKPICards.displayName = 'OverviewKPICards'
