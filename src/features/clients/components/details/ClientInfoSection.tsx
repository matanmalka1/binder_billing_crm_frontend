import { type FC, type ReactNode } from "react";
import { Edit2 } from "lucide-react";
import { Card } from "../../../../components/ui/primitives/Card";
import { Button } from "../../../../components/ui/primitives/Button";
import { Badge } from "../../../../components/ui/primitives/Badge";
import { DefinitionList } from "../../../../components/ui/layout/DefinitionList";
import { cn, formatDate, formatPlainIdentifier, formatShekelAmount } from "@/utils/utils";
import type { ClientResponse } from "../../api";
import {
  CLIENT_STATUS_BADGE_VARIANTS,
  getClientIdNumberTypeLabel,
  getClientStatusLabel,
  getClientVatReportingLabel,
  getEntityTypeLabel,
} from "../../constants";
import { useClientAuthorityContacts } from "../../hooks/useClientAuthorityContacts";
import { useAdvisorOptions } from "@/features/users";

type ClientInfoSectionProps = {
  client: ClientResponse;
  canEdit: boolean;
  onEditStart: () => void;
  sideContent?: ReactNode;
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

const getTaxBranchValue = (value: string | null): string => value ?? EMPTY_VALUE;


const EmptyValue = () => <span className="font-medium text-gray-400">{EMPTY_VALUE}</span>;

const displayValue = (value: ReactNode) => {
  if (value === EMPTY_VALUE || value === "" || value == null) return <EmptyValue />;
  return value;
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
  <Card
    title={title}
    className={cn("shadow-sm", className)}
  >
    {children}
  </Card>
);

const PrimaryMetric = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-3">
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <div className="mt-2 text-base font-semibold text-gray-950">{displayValue(value)}</div>
    {hint ? <p className="mt-1 text-xs font-medium text-gray-500">{hint}</p> : null}
  </div>
);

export const ClientInfoSection: FC<ClientInfoSectionProps> = ({
  client,
  canEdit,
  onEditStart,
  sideContent,
}) => {
  const { nameById } = useAdvisorOptions();
  const { officeByType } = useClientAuthorityContacts(client.id);

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

  const isOsekPatur = client.entity_type === "osek_patur";
  const vatReportingLabel = isOsekPatur
    ? "פטור - לא רלוונטי לדיווח תקופתי"
    : getClientVatReportingLabel(client).replace("—", EMPTY_VALUE);
  const officeClientNumber = formatPlainIdentifier(client.office_client_number, EMPTY_VALUE);
  const statusLabel = getClientStatusLabel(client.status);
  // TODO: Show the updating user when the client details API exposes updated_by.
  const lastUpdatedLabel = client.updated_at
    ? `עודכן לאחרונה: ${formatDate(client.updated_at)}`
    : null;

  const taxItems = [
    {
      label: 'תדירות דיווח מע"מ',
      value: vatReportingLabel,
    },
    ...(isOsekPatur
      ? [{
          label: 'תקרת פטור מע"מ',
          value: client.vat_exempt_ceiling
            ? `${formatShekelAmount(client.vat_exempt_ceiling)} (ערך מערכת)`
            : EMPTY_VALUE,
        }]
      : []),
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
      value: officeClientNumber,
    },
    { label: "מזהה מערכת", value: formatPlainIdentifier(client.id) },
    { label: "סטטוס לקוח", value: getClientStatusLabel(client.status) },
    {
      label: "רואה חשבון מלווה",
      value: client.accountant_id ? nameById.get(client.accountant_id) ?? "לא נמצא שם משתמש" : EMPTY_VALUE,
    },
    { label: "נוצר בתאריך", value: formatDate(client.created_at) },
    { label: "עודכן בתאריך", value: client.updated_at ? formatDate(client.updated_at) : EMPTY_VALUE },
  ];

  return (
    <div className="space-y-6">
      <Card
        className="shadow-sm"
        actions={canEdit ? (
          <Button
            variant="primary"
            size="sm"
            onClick={onEditStart}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            ערוך פרטים
          </Button>
        ) : undefined}
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <h2 className="truncate text-2xl font-semibold leading-tight text-gray-950">
                  {client.full_name}
                </h2>
                <Badge variant={CLIENT_STATUS_BADGE_VARIANTS[client.status]}>{statusLabel}</Badge>
              </div>
              {lastUpdatedLabel ? (
                <p className="text-sm font-medium text-gray-500">{lastUpdatedLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <PrimaryMetric
              label="סטטוס"
              value={<Badge variant={CLIENT_STATUS_BADGE_VARIANTS[client.status]}>{statusLabel}</Badge>}
            />
            <PrimaryMetric
              label="אחוז מקדמה"
              value={client.advance_rate != null ? `${client.advance_rate}%` : "לא אומת"}
              hint={client.advance_rate_updated_at ? `עודכן ${formatDate(client.advance_rate_updated_at)}` : undefined}
            />
            <PrimaryMetric label='דיווח מע"מ' value={vatReportingLabel} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="זהות משפטית">
          <DefinitionList
            columns={2}
            items={identityItems.map((item) => ({ ...item, value: displayValue(item.value) }))}
            className="gap-x-6 gap-y-4"
          />
        </SectionCard>
        <SectionCard title="פרטי קשר">
          <DefinitionList
            columns={2}
            items={contactItems.map((item) => ({ ...item, value: displayValue(item.value) }))}
            className="gap-x-6 gap-y-4"
          />
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <SectionCard title="פרופיל מס">
            <DefinitionList
              columns={3}
              items={taxItems.map((item) => ({ ...item, value: displayValue(item.value) }))}
              className="gap-x-6 gap-y-4"
            />
          </SectionCard>
          <SectionCard title="פרטי משרד">
            <DefinitionList
              columns={3}
              items={officeItems.map((item) => ({ ...item, value: displayValue(item.value) }))}
              className="gap-x-6 gap-y-4"
            />
          </SectionCard>
        </div>
        {sideContent ? <div className="min-w-0">{sideContent}</div> : null}
      </div>
    </div>
  );
};
