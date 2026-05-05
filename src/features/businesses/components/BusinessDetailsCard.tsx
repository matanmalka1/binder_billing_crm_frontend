import { Card } from '@/components/ui/primitives/Card'
import { DefinitionList } from '@/components/ui/layout/DefinitionList'
import type { BusinessResponse, ClientResponse } from '@/features/clients'
import { BusinessNotesCard } from '@/features/notes'
import { BUSINESS_DETAILS_COPY } from '../constants'
import { buildBusinessSummaryItems } from '../utils'

type BusinessDetailsCardProps = {
  business: BusinessResponse
  client: ClientResponse | null
  canEdit?: boolean
}

export const BusinessDetailsCard = ({ business, client, canEdit = false }: BusinessDetailsCardProps) => {
  return (
    <div className="space-y-6">
      <Card title={BUSINESS_DETAILS_COPY.sectionTitle}>
        <DefinitionList columns={4} items={buildBusinessSummaryItems(business, client)} />
      </Card>

      {client && <BusinessNotesCard clientId={client.id} businessId={business.id} canEdit={canEdit} />}
    </div>
  )
}
