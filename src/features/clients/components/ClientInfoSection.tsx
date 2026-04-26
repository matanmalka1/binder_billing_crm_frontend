import { type FC } from "react";
import { Edit2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import { DefinitionList } from "../../../components/ui/layout/DefinitionList";
import { formatClientOfficeId, formatDate } from "@/utils/utils";
import type { ClientResponse } from "../api";
import {
  getClientIdNumberTypeLabel,
  getClientStatusLabel,
  getClientVatReportingLabel,
  getEntityTypeLabel,
} from "../constants";
import { authorityContactsApi, authorityContactsQK } from "../../authorityContacts/api";
import { useAdvisorOptions } from "@/features/users";

type ClientInfoSectionProps = {
  client: ClientResponse;
  canEdit: boolean;
  onEditStart: () => void;
};

/** Formats the five structured address fields into a single human-readable string. */
const formatStructuredAddress = (client: ClientResponse): string => {
  const {
    address_street,
    address_building_number,
    address_apartment,
    address_city,
    address_zip_code,
  } = client;

  if (!address_street && !address_city) return "—";

  const streetPart = [address_street, address_building_number]
    .filter(Boolean)
    .join(" ");
  const aptPart = address_apartment ? `דירה ${address_apartment}` : "";
  const cityPart = [address_zip_code, address_city].filter(Boolean).join(" ");

  return [streetPart, aptPart, cityPart].filter(Boolean).join(", ");
};

export const ClientInfoSection: FC<ClientInfoSectionProps> = ({
  client,
  canEdit,
  onEditStart,
}) => {
  const { nameById } = useAdvisorOptions(canEdit);
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
    : "—";

  const identityItems = [
    { label: "מזהה מערכת", value: formatClientOfficeId(client.id) },
    {
      label: "מספר לקוח במשרד",
      value: client.office_client_number != null ? String(client.office_client_number) : "—",
    },
    { label: "מספר מזהה", value: client.id_number },
    { label: "סוג מזהה", value: idNumberTypeLabel },
    {
      label: "סוג ישות",
      value: client.entity_type ? getEntityTypeLabel(client.entity_type) : "—",
    },
    { label: "קלסר פעיל", value: client.active_binder_number ?? "—" },
    { label: "סטטוס", value: getClientStatusLabel(client.status) },
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
        "—"
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
        "—"
      ),
    },
    { label: "כתובת", value: formatStructuredAddress(client) },
    { label: "נוצר בתאריך", value: formatDate(client.created_at) },
    {
      label: "עודכן בתאריך",
      value: client.updated_at ? formatDate(client.updated_at) : "—",
    },
  ];

  const notesValue = client.notes?.trim() || null;

  const isOsekPatur = client.entity_type === "osek_patur";

  const taxItems = [
    {
      label: 'תדירות דיווח מע"מ',
      value: getClientVatReportingLabel(client),
    },
    ...(isOsekPatur
      ? [
          {
            label: 'תקרת פטור מע"מ',
            value: client.vat_exempt_ceiling
              ? `₪${client.vat_exempt_ceiling}`
              : "—",
          },
        ]
      : []),
    {
      label: "אחוז מקדמה",
      value: client.advance_rate != null ? `${client.advance_rate}%` : "—",
    },
    {
      label: "עודכן מקדמה",
      value: client.advance_rate_updated_at ? formatDate(client.advance_rate_updated_at) : "—",
    },
    {
      label: "רואה חשבון מלווה",
      value: client.accountant_id ? nameById.get(client.accountant_id) ?? `#${client.accountant_id}` : "—",
    },
    { label: 'סניף מע"מ', value: officeByType("vat_branch") ?? "—" },
    { label: "סניף ביטוח לאומי", value: officeByType("national_insurance") ?? "—" },
    { label: "סניף מס הכנסה", value: officeByType("assessing_officer") ?? "—" },
  ];

  return (
    <Card
      title="פרטי לקוח"
      actions={
        canEdit ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onEditStart}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            ערוך פרטים
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        <DefinitionList columns={4} items={identityItems} />
        <div className="border-t border-gray-100 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            נתוני מס
          </p>
          <DefinitionList columns={3} items={taxItems} />
        </div>
        {notesValue && (
          <div className="border-t border-gray-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">הערות</p>
            <p className="whitespace-pre-wrap text-sm text-gray-700">{notesValue}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
