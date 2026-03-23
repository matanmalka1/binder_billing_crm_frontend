import { useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { PageStateGuard } from "@/components/ui/PageStateGuard";
import {
  ClientDetailsTabBar,
  ClientDetailsTabContent,
  useClientDetails,
} from "@/features/clients";
import type { ActiveClientDetailsTab } from "@/features/clients";

interface ClientDetailsProps {
  initialTab?: ActiveClientDetailsTab;
}
export const ClientDetails: FC<ClientDetailsProps> = ({ initialTab = "details" }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState<ActiveClientDetailsTab>(initialTab);
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
    annualReportsTotal,
    vatWorkItemsTotal,
    documentsTotal,
    updateClient,
    isUpdating,
    deleteClient,
    isDeleting,
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
            breadcrumbs={[{ label: "לקוחות", to: "/clients" }, { label: pageTitle, to: `/clients/${clientId}` }]}
          />
        </>
      }
      loadingMessage="טוען פרטי לקוח..."
    >
      {client && (
        <>
          <ClientDetailsTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <ClientDetailsTabContent
            activeTab={activeTab}
            clientId={client.id}
            overviewProps={{
              client,
              canEditClients: can.editClients,
              canViewCharges: can.viewChargeAmounts,
              binders,
              bindersTotal,
              charges,
              chargesTotal,
              annualReportsTotal,
              vatWorkItemsTotal,
              documentsTotal,
              updateClient,
              isUpdating,
              deleteClient,
              isDeleting,
            }}
          />
        </>
      )}
    </PageStateGuard>
  );
};
