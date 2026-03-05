import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { ErrorCard } from "../components/ui/ErrorCard";
import { AccessBanner } from "../components/ui/AccessBanner";
import { PageStateGuard } from "../components/ui/PageStateGuard";
import { DetailDrawer } from "../components/ui/DetailDrawer";
import { Modal } from "../components/ui/Modal";
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
import { VatClientSummaryPanel } from "../features/vatReports/components/VatClientSummaryPanel";
import { ClientAdvancePaymentsTab } from "../features/advancedPayments/components/ClientAdvancePaymentsTab";
import { ClientStatusCard } from "../features/clients/components/ClientStatusCard";
import { cn } from "../utils/utils";

type ActiveTab = "details" | "documents" | "timeline" | "vat" | "advance-payments";

interface ClientDetailsProps {
  initialTab?: ActiveTab;
}

const TAB_LABELS: Record<ActiveTab, string> = {
  details: "פרטים",
  documents: "מסמכים",
  timeline: "ציר זמן",
  vat: 'מע"מ',
  "advance-payments": "מקדמות",
};

const EDIT_FORM_ID = "client-edit-form";

export const ClientDetails: React.FC<ClientDetailsProps> = ({ initialTab = "details" }) => {
  const { clientId } = useParams<{ clientId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const clientIdNum = clientId ? Number(clientId) : null;

  const { client, isValidId, isLoading, error, binders, bindersTotal, charges, chargesTotal,
    annualReportsTotal, vatWorkItemsTotal, documentsTotal, updateClient, isUpdating, deleteClient, isDeleting, can } =
    useClientDetails({ clientId: clientIdNum });

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isEditing]);

  if (!isValidId) return (<div className="space-y-6"><PageHeader title="פרטי לקוח" /><ErrorCard message="מזהה לקוח לא תקין" /></div>);

  const header = (
    <PageHeader
      title={client?.full_name || "פרטי לקוח"}
      breadcrumbs={[{ label: "לקוחות", to: "/clients" }, { label: client?.full_name || "פרטי לקוח", to: `/clients/${clientId}` }]}
    />
  );

  const tabBar = (
    <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 self-start">
      {(["details", "documents", "timeline", "vat", "advance-payments"] as ActiveTab[]).map((tab) => (
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
            <div className="space-y-6">
              <ClientStatusCard clientId={client.id} />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left column — profile info + tax + contacts + correspondence + signatures */}
                <div className="space-y-6 lg:col-span-2">
                  <ClientInfoSection
                    client={client}
                    canEdit={can.editClients}
                    onEditStart={() => setIsEditing(true)}
                    onDeleteStart={can.editClients ? () => setIsConfirmingDelete(true) : undefined}
                  />
                  <TaxProfileCard clientId={client.id} readOnly={!can.editClients} />
                  <AuthorityContactsCard clientId={client.id} />
                  <CorrespondenceCard clientId={client.id} />
                  <SignatureRequestsCard client={client} canManage={can.editClients} />
                </div>

                {/* Right column — consolidated related data (stats + recent lists) */}
                <div className="space-y-6">
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
                </div>
              </div>

              {/* Full-width reminders table */}
              <ClientRemindersCard clientId={client.id} />
            </div>
          )}

          {activeTab === "documents" && (
            <ClientDocumentsTab clientId={client.id} />
          )}

          {activeTab === "timeline" && (
            <ClientTimelineTab clientId={String(client.id)} />
          )}

          {activeTab === "advance-payments" && (
            <ClientAdvancePaymentsTab clientId={client.id} />
          )}

          {activeTab === "vat" && (
            <VatClientSummaryPanel clientId={client.id} />
          )}

          {/* Delete confirmation modal */}
          <Modal
            open={isConfirmingDelete}
            title="מחיקת לקוח"
            onClose={() => setIsConfirmingDelete(false)}
            footer={
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeleting}
                >
                  ביטול
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  isLoading={isDeleting}
                  disabled={isDeleting}
                  onClick={async () => {
                    await deleteClient();
                    setIsConfirmingDelete(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  מחק לקוח
                </Button>
              </div>
            }
          >
            <p className="text-sm text-gray-600">
              האם למחוק את הלקוח <span className="font-semibold">{client.full_name}</span>? פעולה זו אינה ניתנת לביטול.
            </p>
          </Modal>

          {/* Edit drawer — overlays page, scroll locked */}
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
