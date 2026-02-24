import { type FC } from "react";
import { Edit2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { DescriptionList } from "../../../components/ui/DescriptionList";
import { getClientStatusLabel, getClientTypeLabel } from "../../../utils/enums";
import { formatDate } from "../../../utils/utils";
import type { ClientResponse } from "../../../api/clients.api";

type ClientInfoSectionProps = {
  client: ClientResponse;
  canEdit: boolean;
  onEditStart: () => void;
};

const statusBadge = (status: string) => (
  <Badge variant={status === "active" ? "success" : status === "frozen" ? "warning" : "neutral"}>
    {getClientStatusLabel(status)}
  </Badge>
);

export const ClientInfoSection: FC<ClientInfoSectionProps> = ({
  client,
  canEdit,
  onEditStart,
}) => {
  const infoItems = [
    { label: "מזהה לקוח", value: `#${client.id}` },
    { label: "שם מלא", value: client.full_name },
    { label: "מספר זהות / ח.פ", value: client.id_number },
    { label: "סוג לקוח", value: getClientTypeLabel(client.client_type) },
    { label: "סטטוס", value: statusBadge(client.status) },
    { label: "טלפון", value: client.phone || "—" },
    { label: "אימייל", value: client.email || "—" },
    { label: "תאריך פתיחה", value: formatDate(client.opened_at) },
    { label: "תאריך סגירה", value: client.closed_at ? formatDate(client.closed_at) : "—" },
  ];

  return (
    <>
      {canEdit && (
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={onEditStart} className="gap-2">
            <Edit2 className="h-4 w-4" />
            ערוך פרטים
          </Button>
        </div>
      )}

      <Card title="פרטי לקוח">
        <DescriptionList columns={2} items={infoItems} />
      </Card>
    </>
  );
};
