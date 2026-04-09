import { type FC } from "react";
import { Edit2 } from "lucide-react";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import { DefinitionList } from "../../../components/ui/layout/DefinitionList";
import { formatDate } from "../../../utils/utils";
import type { ClientResponse } from "../api";
import { getClientIdNumberTypeLabel, getClientStatusLabel, getEntityTypeLabel } from "../constants";

type ClientInfoSectionProps = {
  client: ClientResponse;
  canEdit: boolean;
  onEditStart: () => void;
};

/** Formats the five structured address fields into a single human-readable string. */
const formatStructuredAddress = (client: ClientResponse): string => {
  const { address_street, address_building_number, address_apartment, address_city, address_zip_code } = client;

  if (!address_street && !address_city) return "—";

  const streetPart = [address_street, address_building_number].filter(Boolean).join(" ");
  const aptPart = address_apartment ? `דירה ${address_apartment}` : "";
  const cityPart = [address_zip_code, address_city].filter(Boolean).join(" ");

  return [streetPart, aptPart, cityPart].filter(Boolean).join(", ");
};

export const ClientInfoSection: FC<ClientInfoSectionProps> = ({
  client,
  canEdit,
  onEditStart,
}) => {
  const idNumberTypeLabel = client.id_number_type
    ? getClientIdNumberTypeLabel(client.id_number_type)
    : "—";

  const infoItems = [
    { label: "מס' לקוח", value: String(client.id) },
    { label: "מספר מזהה", value: client.id_number },
    { label: "סוג מזהה", value: idNumberTypeLabel },
    { label: "סוג ישות", value: client.entity_type ? getEntityTypeLabel(client.entity_type) : "—" },
    { label: "קלסר פעיל", value: client.active_binder_number ?? "—" },
    { label: "סטטוס", value: getClientStatusLabel(client.status) },
    {
      label: "טלפון",
      value: client.phone
        ? <a href={`tel:${client.phone}`} className="text-primary-600 hover:underline">{client.phone}</a>
        : "—",
    },
    {
      label: "אימייל",
      value: client.email
        ? <a href={`mailto:${client.email}`} className="text-primary-600 hover:underline">{client.email}</a>
        : "—",
    },
    { label: "כתובת", value: formatStructuredAddress(client)},
    { label: "נוצר בתאריך", value: formatDate(client.created_at) },
    { label: "עודכן בתאריך", value: client.updated_at ? formatDate(client.updated_at) : "—" },
  ];

  return (
    <Card
      title="פרטי לקוח"
      actions={
        canEdit ? (
          <Button variant="outline" size="sm" onClick={onEditStart} className="gap-2">
            <Edit2 className="h-4 w-4" />
            ערוך פרטים
          </Button>
        ) : undefined
      }
    >
      <DefinitionList columns={4} items={infoItems} />
    </Card>
  );
};
