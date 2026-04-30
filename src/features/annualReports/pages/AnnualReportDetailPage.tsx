import { useParams, Navigate } from 'react-router-dom'
import { AnnualReportFullPanel } from '@/features/annualReports'

export const AnnualReportDetail: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>()
  const id = Number(reportId)

  if (!reportId || isNaN(id)) return <Navigate to="/tax/reports" replace />

  return <AnnualReportFullPanel reportId={id} backPath="/tax/reports" />
}
