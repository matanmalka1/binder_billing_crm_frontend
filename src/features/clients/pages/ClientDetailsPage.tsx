import { type FC } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/overlays/Alert";
import { PageStateGuard } from "@/components/ui/layout/PageStateGuard";
import { CLIENT_ROUTES } from "../api/endpoints";
import type { ActiveClientDetailsTab } from "../constants";
import {
  ClientDetailsTabContent,
  useClientDetails,
} from "@/features/clients";

interface ClientDetailsProps {
  initialTab?: ActiveClientDetailsTab;
}

export const ClientDetails: FC<ClientDetailsProps> = ({ initialTab = "details" }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const clientIdNum = clientId ? Number(clientId) : null;
  const {
    client,
    isValidId,
    isLoading,
    error,
    binders,
    bindersTotal,
    charges,
    chargesTotal,
    updateClient,
    isUpdating,
    deleteClient,
    isDeleting,
    createBusiness,
    isCreatingBusiness,
    can,
  } = useClientDetails({ clientId: clientIdNum });

  if (!isValidId) return (
    <div className="space-y-6">
      <PageHeader title="פרטי לקוח" />
      <Alert variant="error" message="מזהה לקוח לא תקין" />
    </div>
  );
  const pageTitle = client?.full_name || "פרטי לקוח";
  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error || (!client ? "שגיאה בטעינת פרטי לקוח" : null)}
      header={
        <>
          {!can.editClients && <Alert variant="info" message="צפייה בלבד. עריכת פרטי לקוח זמינה ליועצים בלבד." />}
          <PageHeader
            title={pageTitle}
            breadcrumbs={[
              { label: "לקוחות", to: CLIENT_ROUTES.list },
              { label: pageTitle, to: CLIENT_ROUTES.detail(clientId!) },
            ]}
          />
        </>
      }
      loadingMessage="טוען פרטי לקוח..."
    >
      {client ? (
        <ClientDetailsTabContent
          initialTab={initialTab}
          overviewProps={{
            client,
            clientId: client.id,
            canEditClients: can.editClients,
            canViewCharges: can.viewChargeAmounts,
            binders,
            bindersTotal,
            charges,
            chargesTotal,
            updateClient,
            isUpdating,
            deleteClient,
            isDeleting,
            createBusiness,
            isCreatingBusiness,
          }}
        />
      ) : null}
    </PageStateGuard>
  );
};
