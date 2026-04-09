import { type FC } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/overlays/Alert";
import { PageStateGuard } from "@/components/ui/layout/PageStateGuard";
import { getBusinessTypeLabel } from "@/features/clients";
import { useBusinessDetails } from "../hooks/useBusinessDetails";

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
        <PageHeader title="פרטי עסק" />
        <Alert variant="error" message="מזהה לא תקין" />
      </div>
    );
  }

  const businessDisplayName = business
    ? `${getBusinessTypeLabel(business.business_type)}${business.business_name ? ` — ${business.business_name}` : ""}`
    : "פרטי עסק";

  const clientName = client?.full_name ?? "לקוח";

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error}
      header={
        <PageHeader
          title={businessDisplayName}
          breadcrumbs={[
            { label: "לקוחות", to: "/clients" },
            { label: clientName, to: `/clients/${clientId}` },
            { label: businessDisplayName, to: `/clients/${clientId}/businesses/${businessId}` },
          ]}
        />
      }
      loadingMessage="טוען פרטי עסק..."
    >
      {business && businessIdNum != null ? (
        <div className="space-y-6" />
      ) : null}
    </PageStateGuard>
  );
};
