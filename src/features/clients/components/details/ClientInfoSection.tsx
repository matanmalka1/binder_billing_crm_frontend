import { type FC, type ReactNode } from 'react'
import { formatDate, formatPlainIdentifier, formatShekelAmount } from '@/utils/utils'
import type { ClientResponse } from '../../api'
import {
  getClientIdNumberTypeLabel,
  getClientStatusLabel,
  getClientVatReportingLabel,
  getEntityTypeLabel,
} from '../../constants'
import { useClientAuthorityContacts } from '../../hooks/useClientAuthorityContacts'
import { useAdvisorOptions } from '@/features/users'
import { DefinitionSectionCard } from './ClientInfoSectionParts'

type ClientInfoSectionProps = {
  client: ClientResponse
  sideContent?: ReactNode
}

const EMPTY_VALUE = '—'

export const ClientInfoSection: FC<ClientInfoSectionProps> = ({ client, sideContent }) => {
  const { nameById } = useAdvisorOptions()
  const { officeByType } = useClientAuthorityContacts(client.id, client.address_city)

  const idNumberTypeLabel = client.id_number_type
    ? getClientIdNumberTypeLabel(client.id_number_type)
    : EMPTY_VALUE

  const identityItems = [
    { label: 'שם מלא / שם משפטי', value: client.full_name },
    { label: 'מספר מזהה', value: client.id_number || EMPTY_VALUE },
    { label: 'סוג מזהה', value: idNumberTypeLabel },
    {
      label: 'סוג ישות',
      value: client.entity_type ? getEntityTypeLabel(client.entity_type) : EMPTY_VALUE,
    },
  ]

  const contactItems = [
    {
      label: 'טלפון',
      value: client.phone ? (
        <a href={`tel:${client.phone}`} className="text-primary-600 hover:underline">
          {client.phone}
        </a>
      ) : (
        EMPTY_VALUE
      ),
    },
    {
      label: 'אימייל',
      value: client.email ? (
        <a href={`mailto:${client.email}`} className="text-primary-600 hover:underline">
          {client.email}
        </a>
      ) : (
        EMPTY_VALUE
      ),
    },
    { label: 'רחוב', value: client.address_street || EMPTY_VALUE },
    { label: 'מספר בניין', value: client.address_building_number || EMPTY_VALUE },
    { label: 'דירה', value: client.address_apartment || EMPTY_VALUE },
    { label: 'עיר', value: client.address_city || EMPTY_VALUE },
    { label: 'מיקוד', value: client.address_zip_code || EMPTY_VALUE },
  ]

  const isOsekPatur = client.entity_type === 'osek_patur'
  const vatReportingLabel = isOsekPatur
    ? 'פטור - לא רלוונטי לדיווח תקופתי'
    : getClientVatReportingLabel(client).replace('—', EMPTY_VALUE)
  const officeClientNumber = formatPlainIdentifier(client.office_client_number, EMPTY_VALUE)

  const taxItems = [
    {
      label: 'תדירות דיווח מע"מ',
      value: vatReportingLabel,
    },
    ...(isOsekPatur
      ? [
          {
            label: 'תקרת פטור מע"מ',
            value: client.vat_exempt_ceiling
              ? `${formatShekelAmount(client.vat_exempt_ceiling)} (ערך מערכת)`
              : EMPTY_VALUE,
          },
        ]
      : []),
    {
      label: 'אחוז מקדמה',
      value: client.advance_rate != null ? `${client.advance_rate}%` : 'לא אומת',
    },
    {
      label: 'עדכון מקדמה',
      value: client.advance_rate_updated_at
        ? formatDate(client.advance_rate_updated_at)
        : EMPTY_VALUE,
    },
    { label: 'סניף מע"מ', value: officeByType('vat_branch') ?? EMPTY_VALUE },
    { label: 'סניף ביטוח לאומי', value: officeByType('national_insurance') ?? EMPTY_VALUE },
    { label: 'סניף מס הכנסה', value: officeByType('assessing_officer') ?? EMPTY_VALUE },
  ]

  const officeItems = [
    {
      label: 'מספר לקוח במשרד',
      value: officeClientNumber,
    },
    { label: 'מזהה מערכת', value: formatPlainIdentifier(client.id) },
    { label: 'סטטוס לקוח', value: getClientStatusLabel(client.status) },
    {
      label: 'רואה חשבון מלווה',
      value: client.accountant_id
        ? (nameById.get(client.accountant_id) ?? 'לא נמצא שם משתמש')
        : EMPTY_VALUE,
    },
    { label: 'נוצר בתאריך', value: formatDate(client.created_at) },
    {
      label: 'עודכן בתאריך',
      value: client.updated_at ? formatDate(client.updated_at) : EMPTY_VALUE,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DefinitionSectionCard title="זהות משפטית" items={identityItems} columns={2} />
        <DefinitionSectionCard title="פרטי קשר" items={contactItems} columns={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-4">
          <DefinitionSectionCard title="פרופיל מס" items={taxItems} columns={3} />
          <DefinitionSectionCard title="פרטי משרד" items={officeItems} columns={3} />
        </div>
        {sideContent ? <div className="min-w-0">{sideContent}</div> : null}
      </div>
    </div>
  )
}
