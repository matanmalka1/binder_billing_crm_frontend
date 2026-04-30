import type { UseFormReturn } from 'react-hook-form'
import { DetailDrawer } from '@/components/ui/overlays/DetailDrawer'
import type { ReceiveBinderFormValues } from '../../schemas'
import type { AnnualReportFull } from '@/features/annualReports'
import { BinderReceivePanel } from './BinderReceivePanel'

interface ReceiveBinderDrawerProps {
  open: boolean
  onClose: () => void
  form: UseFormReturn<ReceiveBinderFormValues>
  clientQuery: string
  selectedClient: { id: number; name: string; client_status?: string | null } | null
  businesses: { id: number; business_name: string | null }[]
  annualReports: AnnualReportFull[]
  hasActiveBinder: boolean
  vatType: 'monthly' | 'bimonthly' | 'exempt' | null
  onClientSelect: (client: {
    id: number
    name: string
    id_number: string
    client_status?: string | null
  }) => void
  onClientQueryChange: (query: string) => void
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  isSubmitting: boolean
}

export const ReceiveBinderDrawer: React.FC<ReceiveBinderDrawerProps> = ({
  open,
  onClose,
  form,
  clientQuery,
  selectedClient,
  businesses,
  annualReports,
  hasActiveBinder,
  vatType,
  onClientSelect,
  onClientQueryChange,
  onSubmit,
  isSubmitting,
}) => (
  <DetailDrawer
    open={open}
    title="קליטת חומר מלקוח"
    onClose={onClose}
    isDirty={form.formState.isDirty}
  >
    <BinderReceivePanel
      form={form}
      clientQuery={clientQuery}
      selectedClient={selectedClient}
      businesses={businesses}
      annualReports={annualReports}
      hasActiveBinder={hasActiveBinder}
      vatType={vatType}
      onClientSelect={onClientSelect}
      onClientQueryChange={onClientQueryChange}
      onSubmit={onSubmit}
      onClose={onClose}
      isSubmitting={isSubmitting}
    />
  </DetailDrawer>
)

ReceiveBinderDrawer.displayName = 'ReceiveBinderDrawer'
