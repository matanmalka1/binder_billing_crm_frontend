import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { ErrorCard } from "../components/ui/ErrorCard";
import { AccessBanner } from "../components/ui/AccessBanner";
import { PageStateGuard } from "../components/ui/PageStateGuard";
import { ClientEditForm } from "../features/clients/components/ClientEditForm";
import { AuthorityContactsCard } from "../features/authorityContacts/components/AuthorityContactsCard";
import { TaxProfileCard } from "../features/taxProfile/components/TaxProfileCard";
import { CorrespondenceCard } from "../features/correspondence/components/CorrespondenceCard";
import { ClientInfoSection } from "../features/clients/components/ClientInfoSection";
import { ClientRelatedData } from "../features/clients/components/ClientRelatedData";
import { useRole } from "../hooks/useRole";
import { useClientDetails } from "../features/clients/hooks/useClientDetails";

export const ClientDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { can } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const clientIdNum = clientId ? Number(clientId) : null;

  const { client, isValidId, isLoading, error, binders, bindersTotal, charges, chargesTotal, updateClient, isUpdating } =
    useClientDetails({ clientId: clientIdNum });

  if (!isValidId) return (<div className="space-y-6"><PageHeader title="פרטי לקוח" /><ErrorCard message="מזהה לקוח לא תקין" /></div>);

  const header = (
    <PageHeader
      title={client?.full_name || "פרטי לקוח"}
      breadcrumbs={[{ label: "לקוחות", to: "/clients" }, { label: client?.full_name || "פרטי לקוח", to: `/clients/${clientId}` }]}
    />
  );

  return (
    <div className="space-y-6">
      {!can.editClients && <AccessBanner variant="info" message="צפייה בלבד. עריכת פרטי לקוח זמינה ליועצים בלבד." />}

      <PageStateGuard
        isLoading={isLoading}
        error={error || (!client ? "שגיאה בטעינת פרטי לקוח" : null)}
        header={header}
        loadingMessage="טוען פרטי לקוח..."
      >
        {header}
        {client && (
          <>
            {isEditing && can.editClients ? (
              <ClientEditForm
                client={client}
                onSave={async (data) => {
                  await updateClient(data);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
                isLoading={isUpdating}
              />
            ) : (
              <ClientInfoSection
                client={client}
                canEdit={can.editClients}
                onEditStart={() => setIsEditing(true)}
                onTimeline={() => navigate(`/clients/${clientId}/timeline`)}
              />
            )}

            <ClientRelatedData
              clientId={client.id}
              binders={binders}
              bindersTotal={bindersTotal}
              charges={charges}
              chargesTotal={chargesTotal}
              canViewCharges={can.viewChargeAmounts}
            />

            {can.editClients && <TaxProfileCard clientId={client.id} />}

            <AuthorityContactsCard clientId={client.id} />

            <CorrespondenceCard clientId={client.id} />
          </>
        )}
      </PageStateGuard>
    </div>
  );
};
