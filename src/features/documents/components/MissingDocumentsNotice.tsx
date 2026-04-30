import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, CheckCircle2, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/primitives/Card'
import { documentsApi, documentsQK } from '../api'
import { getDocumentTypeLabel } from './DocumentsDataCards.utils'

interface MissingDocumentsNoticeProps {
  clientId: number
  showCompleteState?: boolean
}

export const MissingDocumentsNotice: React.FC<MissingDocumentsNoticeProps> = ({
  clientId,
  showCompleteState = false,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: documentsQK.clientSignals(clientId),
    queryFn: () => documentsApi.getSignalsByClient(clientId),
    enabled: clientId > 0,
    staleTime: 30_000,
    retry: 1,
  })

  if (isLoading || isError) return null

  const missingDocuments = data?.missing_documents ?? []

  if (missingDocuments.length === 0) {
    if (!showCompleteState) return null

    return (
      <Card className="border-emerald-200 bg-emerald-50/70">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-950">כל מסמכי החובה קיימים</p>
            <p className="mt-1 text-sm text-emerald-800">
              אין כרגע מסמכים חסרים בפרטי הלקוח.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 bg-amber-50/80">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-950">
              חסרים {missingDocuments.length} מסמכים בפרטי הלקוח
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {missingDocuments.map((documentType) => (
                <span
                  key={documentType}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-900"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {getDocumentTypeLabel(documentType)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Link
          to={`/clients/${clientId}/documents`}
          className="inline-flex shrink-0 items-center justify-center rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-100"
        >
          מעבר למסמכים
        </Link>
      </div>
    </Card>
  )
}

MissingDocumentsNotice.displayName = 'MissingDocumentsNotice'
