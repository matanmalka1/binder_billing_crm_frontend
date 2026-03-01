import { useParams } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { ErrorCard } from "../components/ui/ErrorCard";
import { AccessBanner } from "../components/ui/AccessBanner";
import { PageStateGuard } from "../components/ui/PageStateGuard";
import { DetailDrawer } from "../components/ui/DetailDrawer";
import { Button } from "../components/ui/Button";
import { ClientEditForm } from "../features/clients/components/ClientEditForm";
import { AuthorityContactsCard } from "../features/authorityContacts/components/AuthorityContactsCard";
import { TaxProfileCard } from "../features/taxProfile/components/TaxProfileCard";
import { CorrespondenceCard } from "../features/correspondence/components/CorrespondenceCard";
import { ClientInfoSection } from "../features/clients/components/ClientInfoSection";
import { ClientRelatedData } from "../features/clients/components/ClientRelatedData";
import { useClientDetails } from "../features/clients/hooks/useClientDetails";
import { SignatureRequestsCard } from "../features/signatureRequests/components/SignatureRequestsCard";
import { ClientRemindersCard } from "../features/reminders/components/ClientRemindersCard";
import { ClientDocumentsTab } from "../features/documents/components/ClientDocumentsTab";
import { ClientTimelineTab } from "../features/timeline/components/ClientTimelineTab";
import { cn } from "../utils/utils";

type ActiveTab = "details" | "documents" | "timeline";

const TAB_LABELS: Record<ActiveTab, string> = {
  details: "פרטים",
  documents: "מסמכים",
  timeline: "ציר זמן",
};

const EDIT_FORM_ID = "client-edit-form";

export const ClientDetails: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("details");
  const clientIdNum = clientId ? Number(clientId) : null;

  const { client, isValidId, isLoading, error, binders, bindersTotal, charges, chargesTotal,
    annualReportsTotal, vatWorkItemsTotal, documentsTotal, updateClient, isUpdating, can } =
    useClientDetails({ clientId: clientIdNum });

  if (!isValidId) return (<div className="space-y-6"><PageHeader title="פרטי לקוח" /><ErrorCard message="מזהה לקוח לא תקין" /></div>);

  const header = (
    <PageHeader
      title={client?.full_name || "פרטי לקוח"}
      breadcrumbs={[{ label: "לקוחות", to: "/clients" }, { label: client?.full_name || "פרטי לקוח", to: `/clients/${clientId}` }]}
    />
  );

  const tabBar = (
    <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 self-start">
      {(["details", "documents", "timeline"] as ActiveTab[]).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
            activeTab === tab
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          {TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error || (!client ? "שגיאה בטעינת פרטי לקוח" : null)}
      header={
        <>
          {!can.editClients && <AccessBanner variant="info" message="צפייה בלבד. עריכת פרטי לקוח זמינה ליועצים בלבד." />}
          {header}
        </>
      }
      loadingMessage="טוען פרטי לקוח..."
    >
      {client && (
        <>
          {tabBar}

          {activeTab === "details" && (
            <>
              <ClientInfoSection
                client={client}
                canEdit={can.editClients}
                onEditStart={() => setIsEditing(true)}
              />

              <ClientRelatedData
                clientId={client.id}
                binders={binders}
                bindersTotal={bindersTotal}
                charges={charges}
                chargesTotal={chargesTotal}
                canViewCharges={can.viewChargeAmounts}
                annualReportsTotal={annualReportsTotal}
                vatWorkItemsTotal={vatWorkItemsTotal}
                documentsTotal={documentsTotal}
              />

              {can.editClients && <TaxProfileCard clientId={client.id} />}

              <AuthorityContactsCard clientId={client.id} />

              <CorrespondenceCard clientId={client.id} />

              <ClientRemindersCard clientId={client.id} />

              <SignatureRequestsCard client={client} canManage={can.editClients} />
            </>
          )}

          {activeTab === "documents" && (
            <ClientDocumentsTab clientId={client.id} />
          )}

          {activeTab === "timeline" && (
            <ClientTimelineTab clientId={String(client.id)} />
          )}

          {/* Edit drawer — overlays page so client context stays visible */}
          {can.editClients && (
            <DetailDrawer
              open={isEditing}
              title="עריכת פרטי לקוח"
              subtitle={client.full_name}
              onClose={() => setIsEditing(false)}
              footer={
                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                  >
                    ביטול
                  </Button>
                  <Button
                    type="submit"
                    form={EDIT_FORM_ID}
                    variant="primary"
                    isLoading={isUpdating}
                    disabled={isUpdating}
                  >
                    שמור שינויים
                  </Button>
                </div>
              }
            >
              <ClientEditForm
                client={client}
                formId={EDIT_FORM_ID}
                hideFooter
                onSave={async (data) => {
                  await updateClient(data);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
                isLoading={isUpdating}
              />
            </DetailDrawer>
          )}
        </>
      )}
    </PageStateGuard>
  );
};
