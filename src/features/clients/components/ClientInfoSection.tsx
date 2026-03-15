import { type FC } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { DefinitionList } from "../../../components/ui/DefinitionList";
import { getClientStatusLabel, getClientTypeLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import type { ClientResponse } from "../../../api/clients.api";

type ClientInfoSectionProps = {
  client: ClientResponse;
  canEdit: boolean;
  onEditStart: () => void;
  onDeleteStart?: () => void;
};

const statusBadge = (status: string) => (
  <Badge variant={status === "active" ? "success" : status === "frozen" ? "warning" : "neutral"}>
    {getClientStatusLabel(status)}
  </Badge>
);

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
  onDeleteStart,
}) => {
  const infoItems = [
    { label: "מספר זהות / ח.פ", value: client.id_number },
    { label: "סוג לקוח", value: getClientTypeLabel(client.client_type) },
    { label: "סטטוס", value: statusBadge(client.status) },
    { label: "טלפון", value: client.phone || "—" },
    { label: "אימייל", value: client.email || "—" },
    { label: "כתובת למשלוח", value: formatStructuredAddress(client) },
    { label: "תיק קלסר ראשי", value: client.primary_binder_number || "—" },
    { label: "תאריך פתיחה", value: formatDate(client.opened_at) },
    { label: "תאריך סגירה", value: client.closed_at ? formatDate(client.closed_at) : "—" },
  ];

  return (
    <Card
      title="פרטי לקוח"
      actions={
        canEdit ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEditStart} className="gap-2">
              <Edit2 className="h-4 w-4" />
              ערוך פרטים
            </Button>
            {onDeleteStart && (
              <Button variant="outline" size="sm" onClick={onDeleteStart} className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                מחק לקוח
              </Button>
            )}
          </div>
        ) : undefined
      }
    >
      <DefinitionList columns={2} items={infoItems} />
    </Card>
  );
};