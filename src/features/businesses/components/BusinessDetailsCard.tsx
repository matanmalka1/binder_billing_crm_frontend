import { Link } from "react-router-dom";
import { Card } from "@/components/ui/primitives/Card";
import { DefinitionList } from "@/components/ui/layout/DefinitionList";
import {
  CLIENT_ROUTES,
  getBusinessStatusLabel,
  getBusinessTypeLabel,
  type BusinessResponse,
  type ClientResponse,
} from "@/features/clients";
import { formatClientOfficeId, formatDate } from "@/utils/utils";
import { BUSINESS_DETAILS_COPY } from "../constants";

type BusinessDetailsCardProps = {
  business: BusinessResponse;
  client: ClientResponse | null;
};

export const BusinessDetailsCard = ({ business, client }: BusinessDetailsCardProps) => {
  const summaryItems = [
    { label: "מזהה מערכת", value: formatClientOfficeId(business.id) },
    {
      label: "לקוח",
      value: client ? (
        <Link
          to={CLIENT_ROUTES.detail(client.id)}
          className="text-primary-600 hover:underline"
        >
          {client.full_name}
        </Link>
      ) : (
        "—"
      ),
    },
    { label: "שם עסק", value: business.business_name ?? "—" },
    { label: "סוג עסק", value: getBusinessTypeLabel(business.business_type) },
    { label: "סטטוס", value: getBusinessStatusLabel(business.status) },
    { label: "נפתח בתאריך", value: formatDate(business.opened_at) },
    { label: "נסגר בתאריך", value: formatDate(business.closed_at) },
    { label: "נוצר בתאריך", value: formatDate(business.created_at) },
  ];

  return (
    <Card title={BUSINESS_DETAILS_COPY.sectionTitle}>
      <div className="space-y-6">
        <DefinitionList columns={4} items={summaryItems} />
        <div className="border-t border-gray-100 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {BUSINESS_DETAILS_COPY.notesTitle}
          </p>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            {business.notes ?? BUSINESS_DETAILS_COPY.noNotes}
          </div>
        </div>
      </div>
    </Card>
  );
};
