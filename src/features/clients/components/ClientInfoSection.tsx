import { type FC } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Card } from "../../../components/ui/primitives/Card";
import { Button } from "../../../components/ui/primitives/Button";
import { DefinitionList } from "../../../components/ui/layout/DefinitionList";
import { formatDate } from "../../../utils/utils";
import type { ClientResponse } from "../api";

type ClientInfoSectionProps = {
  client: ClientResponse;
  canEdit: boolean;
  onEditStart: () => void;
  onDeleteStart?: () => void;
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
  onDeleteStart,
}) => {
  const infoItems = [
    { label: "מספר זהות / ח.פ", value: client.id_number },
    { label: "סוג מזהה", value: client.id_number_type ?? "—" },
    { label: "טלפון", value: client.phone || "—" },
    { label: "אימייל", value: client.email || "—" },
    { label: "כתובת", value: formatStructuredAddress(client) },
    { label: "נוצר בתאריך", value: formatDate(client.created_at) },
    { label: "עודכן בתאריך", value: client.updated_at ? formatDate(client.updated_at) : "—" },
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
