import { type FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BriefcaseBusiness, Edit2, Fingerprint } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/overlays/Alert'
import { PageStateGuard } from '@/components/ui/layout/PageStateGuard'
import { Badge } from '@/components/ui/primitives/Badge'
import { Button } from '@/components/ui/primitives/Button'
import { formatPlainIdentifier } from '@/utils/utils'
import { CLIENT_ROUTES } from '../api/endpoints'
import {
  CLIENT_STATUS_BADGE_VARIANTS,
  getClientStatusLabel,
  getEntityTypeLabel,
  type ActiveClientDetailsTab,
} from '../constants'
import { ClientDetailsTabContent, useClientDetails } from '@/features/clients'
import type { ClientResponse } from '../api'

interface ClientDetailsProps {
  initialTab?: ActiveClientDetailsTab
}

const ClientHeaderMetaItem: FC<{ icon: React.ReactNode; label: React.ReactNode }> = ({
  icon,
  label,
}) => (
  <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-gray-600">
    <span className="shrink-0 text-gray-500">{icon}</span>
    <span className="truncate">{label}</span>
  </span>
)

const buildClientHeader = (client: ClientResponse) => ({
  title: (
    <span className="flex min-w-0 flex-wrap items-center gap-3">
      <span className="truncate">{client.full_name}</span>
      <Badge variant={CLIENT_STATUS_BADGE_VARIANTS[client.status]}>
        {getClientStatusLabel(client.status)}
      </Badge>
    </span>
  ),
  description: (
    <span className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2">
      <ClientHeaderMetaItem
        icon={<Fingerprint className="h-4 w-4" />}
        label={`ת.ז / ח.פ : ${formatPlainIdentifier(client.id_number, 'לא הוגדר')}`}
      />
      <ClientHeaderMetaItem
        icon={<BriefcaseBusiness className="h-4 w-4" />}
        label={`סוג ישות: ${client.entity_type ? getEntityTypeLabel(client.entity_type) : '—'}`}
      />
    </span>
  ),
})

export const ClientDetails: FC<ClientDetailsProps> = ({ initialTab = 'details' }) => {
  const { clientId } = useParams<{ clientId: string }>()
  const clientIdNum = clientId ? Number(clientId) : null
  const [isEditing, setIsEditing] = useState(false)
  const {
    client,
    isValidId,
    isLoading,
    error,
    updateClient,
    isUpdating,
    deleteClient,
    isDeleting,
    can,
  } = useClientDetails({ clientId: clientIdNum })

  useEffect(() => {
    if (initialTab !== 'details') setIsEditing(false)
  }, [initialTab])

  if (!isValidId)
    return (
      <div className="space-y-6">
        <PageHeader title="פרטי לקוח" />
        <Alert variant="error" message="מזהה לקוח לא תקין" />
      </div>
    )

  const clientHeader = client ? buildClientHeader(client) : null

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error || (!client ? 'שגיאה בטעינת פרטי לקוח' : null)}
      header={
        <>
          {!can.editClients && (
            <Alert variant="info" message="צפייה בלבד. עריכת פרטי לקוח זמינה ליועצים בלבד." />
          )}
          <PageHeader
            title={clientHeader?.title ?? client?.full_name ?? 'פרטי לקוח'}
            description={clientHeader?.description}
            actions={
              can.editClients && initialTab === 'details' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  ערוך פרטים
                </Button>
              ) : undefined
            }
            breadcrumbs={[
              { label: 'לקוחות', to: CLIENT_ROUTES.list },
              { label: client?.full_name ?? 'פרטי לקוח', to: CLIENT_ROUTES.detail(clientId!) },
            ]}
          />
        </>
      }
      loadingMessage="טוען פרטי לקוח..."
    >
      {client ? (
        <ClientDetailsTabContent
          initialTab={initialTab}
          overviewProps={{
            client,
            clientId: client.id,
            canEditClients: can.editClients,
            updateClient,
            isUpdating,
            deleteClient,
            isDeleting,
            isEditing,
            onEditClose: () => setIsEditing(false),
          }}
        />
      ) : null}
    </PageStateGuard>
  )
}
