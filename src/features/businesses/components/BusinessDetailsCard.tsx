import { Link } from "react-router-dom";
import { Card } from "@/components/ui/primitives/Card";
import { DefinitionList } from "@/components/ui/layout/DefinitionList";
import { CLIENT_ROUTES } from "@/features/clients";
import type { BusinessResponse, ClientResponse } from "@/features/clients";
import { BusinessNotesCard } from "@/features/notes";
import { formatClientOfficeId, formatDate } from "@/utils/utils";
import {
  BUSINESS_DETAILS_COPY,
  getBusinessStatusLabel,
} from "../constants";

type BusinessDetailsCardProps = {
  business: BusinessResponse;
  client: ClientResponse | null;
  canEdit?: boolean;
};

export const BusinessDetailsCard = ({ business, client, canEdit = false }: BusinessDetailsCardProps) => {
  const summaryItems = [
    { label: BUSINESS_DETAILS_COPY.systemIdLabel, value: formatClientOfficeId(business.id) },
    {
      label: BUSINESS_DETAILS_COPY.clientLabel,
      value: client ? (
        <Link
          to={CLIENT_ROUTES.detail(client.id)}
          className="text-primary-600 hover:underline"
        >
          {client.full_name}
        </Link>
      ) : (
        BUSINESS_DETAILS_COPY.emptyValue
      ),
    },
    { label: BUSINESS_DETAILS_COPY.businessNameLabel, value: business.business_name ?? BUSINESS_DETAILS_COPY.emptyValue },
    { label: BUSINESS_DETAILS_COPY.statusLabel, value: getBusinessStatusLabel(business.status) },
    { label: BUSINESS_DETAILS_COPY.openedAtLabel, value: formatDate(business.opened_at) },
    { label: BUSINESS_DETAILS_COPY.closedAtLabel, value: formatDate(business.closed_at) },
    { label: BUSINESS_DETAILS_COPY.createdAtLabel, value: formatDate(business.created_at) },
  ];

  return (
    <div className="space-y-6">
      <Card title={BUSINESS_DETAILS_COPY.sectionTitle}>
        <DefinitionList columns={4} items={summaryItems} />
      </Card>

      {client && (
        <BusinessNotesCard
          clientId={client.id}
          businessId={business.id}
          canEdit={canEdit}
        />
      )}
    </div>
  );
};
