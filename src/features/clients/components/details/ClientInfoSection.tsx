import { type FC, type ReactNode } from "react";
import { Edit2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../../../../components/ui/primitives/Card";
import { Button } from "../../../../components/ui/primitives/Button";
import { Badge, type BadgeVariant } from "../../../../components/ui/primitives/Badge";
import { DefinitionList } from "../../../../components/ui/layout/DefinitionList";
import { cn, formatClientOfficeId, formatDate } from "@/utils/utils";
import type { ClientResponse } from "../../api";
import {
  getClientIdNumberTypeLabel,
  getClientStatusLabel,
  getClientVatReportingLabel,
  getEntityTypeLabel,
} from "../../constants";
import { authorityContactsApi, authorityContactsQK } from "../../../authorityContacts/api";
import { useAdvisorOptions } from "@/features/users";

type ClientInfoSectionProps = {
  client: ClientResponse;
  canEdit: boolean;
  onEditStart: () => void;
};

const EMPTY_VALUE = "לא הוגדר";

const formatStructuredAddress = (client: ClientResponse): string => {
  const {
    address_street,
    address_building_number,
    address_apartment,
    address_city,
    address_zip_code,
  } = client;

  if (!address_street && !address_city) return EMPTY_VALUE;

  const streetPart = [address_street, address_building_number]
    .filter(Boolean)
    .join(" ");
  const aptPart = address_apartment ? `דירה ${address_apartment}` : "";
  const cityPart = [address_zip_code, address_city].filter(Boolean).join(" ");

  return [streetPart, aptPart, cityPart].filter(Boolean).join(", ");
};

const formatMoney = (value: string | null): string =>
  value ? `₪${Number(value).toLocaleString("he-IL")}` : EMPTY_VALUE;

const getTaxBranchValue = (value: string | null): string => value ?? EMPTY_VALUE;

const statusVariantMap: Record<ClientResponse["status"], BadgeVariant> = {
  active: "success",
  frozen: "warning",
  closed: "neutral",
};

const SectionCard = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <section className={cn("rounded-xl border border-gray-200 bg-white p-5", className)}>
    <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
    {children}
  </section>
);

const SummaryCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <div className="mt-2 text-base font-semibold text-gray-950">{value}</div>
    {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
  </div>
);

export const ClientInfoSection: FC<ClientInfoSectionProps> = ({
  client,
  canEdit,
  onEditStart,
}) => {
  const { nameById } = useAdvisorOptions();
  const { data: contactsData } = useQuery({
    queryKey: [...authorityContactsQK.forClient(client.id), { page: 1, page_size: 20 }],
    queryFn: () => authorityContactsApi.listAuthorityContacts(client.id, undefined, 1, 20),
    enabled: client.id > 0,
    staleTime: 60_000,
  });
  const contacts = contactsData?.items ?? [];
  const officeByType = (type: string) =>
    contacts.find((c) => c.contact_type === type)?.office ?? null;

  const idNumberTypeLabel = client.id_number_type
    ? getClientIdNumberTypeLabel(client.id_number_type)
    : EMPTY_VALUE;

  const identityItems = [
    { label: "שם מלא / שם משפטי", value: client.full_name },
    { label: "מספר מזהה", value: client.id_number || EMPTY_VALUE },
    { label: "סוג מזהה", value: idNumberTypeLabel },
    {
      label: "סוג ישות",
      value: client.entity_type ? getEntityTypeLabel(client.entity_type) : EMPTY_VALUE,
    },
  ];

  const contactItems = [
    {
      label: "טלפון",
      value: client.phone ? (
        <a
          href={`tel:${client.phone}`}
          className="text-primary-600 hover:underline"
        >
          {client.phone}
        </a>
      ) : (
        EMPTY_VALUE
      ),
    },
    {
      label: "אימייל",
      value: client.email ? (
        <a
          href={`mailto:${client.email}`}
          className="text-primary-600 hover:underline"
        >
          {client.email}
        </a>
      ) : (
        EMPTY_VALUE
      ),
    },
    { label: "כתובת", value: formatStructuredAddress(client) },
  ];

  const notesValue = client.notes?.trim() || null;

  const isOsekPatur = client.entity_type === "osek_patur";
  const vatReportingLabel = isOsekPatur
    ? "פטור - לא רלוונטי לדיווח תקופתי"
    : getClientVatReportingLabel(client).replace("—", EMPTY_VALUE);
  const entityTypeLabel = client.entity_type
    ? getEntityTypeLabel(client.entity_type)
    : EMPTY_VALUE;
  const officeClientNumber = client.office_client_number != null
    ? formatClientOfficeId(client.office_client_number)
    : EMPTY_VALUE;
  const statusLabel = getClientStatusLabel(client.status);

  const taxItems = [
    {
      label: 'תדירות דיווח מע"מ',
      value: vatReportingLabel,
    },
    {
      label: 'תקרת פטור מע"מ',
      value: isOsekPatur ? `${formatMoney(client.vat_exempt_ceiling)} (ערך מערכת)` : "לא רלוונטי",
    },
    {
      label: "אחוז מקדמה",
      value: client.advance_rate != null ? `${client.advance_rate}%` : "לא אומת",
    },
    {
      label: "מקור / תאריך עדכון מקדמה",
      value: client.advance_rate_updated_at
        ? `עודכן בתאריך ${formatDate(client.advance_rate_updated_at)}`
        : "לא קיים תאריך עדכון",
    },
    { label: 'סניף מע"מ', value: getTaxBranchValue(officeByType("vat_branch")) },
    { label: "סניף ביטוח לאומי", value: getTaxBranchValue(officeByType("national_insurance")) },
    { label: "סניף מס הכנסה", value: getTaxBranchValue(officeByType("assessing_officer")) },
  ];

  const officeItems = [
    {
      label: "מספר לקוח במשרד",
      value: client.office_client_number != null ? formatClientOfficeId(client.office_client_number) : EMPTY_VALUE,
    },
    { label: "סטטוס לקוח", value: getClientStatusLabel(client.status) },
    {
      label: "רואה חשבון מלווה",
      value: client.accountant_id ? nameById.get(client.accountant_id) ?? "לא נמצא שם משתמש" : EMPTY_VALUE,
    },
    { label: "נוצר בתאריך", value: formatDate(client.created_at) },
    {
      label: "עודכן בתאריך",
      value: client.updated_at ? formatDate(client.updated_at) : EMPTY_VALUE,
    },
    { label: "מזהה מערכת", value: `#${client.id}` },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-semibold text-gray-950">
                {client.full_name}
              </h2>
              <Badge variant={statusVariantMap[client.status]}>{statusLabel}</Badge>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
              <span>מספר לקוח במשרד: {officeClientNumber}</span>
              <span>סוג ישות: {entityTypeLabel}</span>
              <span>מזהה מערכת: #{client.id}</span>
            </div>
          </div>
          {canEdit ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditStart}
              className="gap-2 self-start"
            >
              <Edit2 className="h-4 w-4" />
              ערוך פרטים
            </Button>
          ) : null}
        </div>
      </Card>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="סטטוס"
            value={<Badge variant={statusVariantMap[client.status]}>{statusLabel}</Badge>}
          />
          <SummaryCard label="סוג ישות" value={entityTypeLabel} />
          <SummaryCard
            label="אחוז מקדמה"
            value={client.advance_rate != null ? `${client.advance_rate}%` : "לא אומת"}
            hint={client.advance_rate_updated_at ? `עודכן ${formatDate(client.advance_rate_updated_at)}` : undefined}
          />
          <SummaryCard label='דיווח מע"מ' value={vatReportingLabel} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionCard title="זהות משפטית">
            <DefinitionList columns={2} items={identityItems} />
          </SectionCard>
          <SectionCard title="פרטי קשר">
            <DefinitionList columns={2} items={contactItems} />
          </SectionCard>
          <SectionCard title="פרופיל מס">
            <DefinitionList columns={2} items={taxItems} />
          </SectionCard>
          <SectionCard title="פרטי משרד">
            <DefinitionList columns={2} items={officeItems} />
          </SectionCard>
        </div>

        <SectionCard title="הערות פנימיות">
          <p className="whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {notesValue || EMPTY_VALUE}
          </p>
        </SectionCard>
      </div>
    </div>
  );
};
