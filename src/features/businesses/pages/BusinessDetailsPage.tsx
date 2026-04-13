import { type FC } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/overlays/Alert";
import { PageStateGuard } from "@/components/ui/layout/PageStateGuard";
import { CLIENT_ROUTES, getBusinessTypeLabel } from "@/features/clients";
import { useBusinessDetails } from "../hooks/useBusinessDetails";
import { BusinessDetailsCard } from "../components/BusinessDetailsCard";
import { BUSINESS_DETAILS_COPY } from "../constants";

export const BusinessDetails: FC = () => {
  const { clientId, businessId } = useParams<{
    clientId: string;
    businessId: string;
  }>();
  const clientIdNum = clientId ? Number(clientId) : null;
  const businessIdNum = businessId ? Number(businessId) : null;

  const { client, business, isLoading, error, isValidId } = useBusinessDetails({
    clientId: clientIdNum,
    businessId: businessIdNum,
  });

  if (!isValidId) {
    return (
      <div className="space-y-6">
        <PageHeader title={BUSINESS_DETAILS_COPY.title} />
        <Alert variant="error" message={BUSINESS_DETAILS_COPY.invalidId} />
      </div>
    );
  }

  const businessDisplayName = business
    ? `${getBusinessTypeLabel(business.business_type)}${business.business_name ? ` — ${business.business_name}` : ""}`
    : BUSINESS_DETAILS_COPY.title;

  const clientName = client?.full_name ?? BUSINESS_DETAILS_COPY.clientFallback;

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error}
      header={
        <PageHeader
          title={businessDisplayName}
          breadcrumbs={[
            { label: "לקוחות", to: CLIENT_ROUTES.list },
            { label: clientName, to: CLIENT_ROUTES.detail(clientId!) },
            { label: businessDisplayName, to: CLIENT_ROUTES.businessDetail(clientId!, businessId!) },
          ]}
        />
      }
      loadingMessage={BUSINESS_DETAILS_COPY.loading}
    >
      {business ? <BusinessDetailsCard business={business} client={client} /> : null}
    </PageStateGuard>
  );
};
