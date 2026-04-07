import { type FC, useEffect, useState } from "react";
import { type ActiveClientDetailsTab } from "../constants";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { DetailDrawer } from "../../../components/ui/overlays/DetailDrawer";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Button } from "../../../components/ui/primitives/Button";
import { AuthorityContactsCard } from "../../authorityContacts/components/AuthorityContactsCard";
import { CorrespondenceCard } from "../../correspondence/components/CorrespondenceCard";
import { SignatureRequestsCard } from "../../signatureRequests/components/SignatureRequestsCard";
import { ClientRemindersCard } from "../../reminders/components/ClientRemindersCard";
import { NotificationsTab } from "../../notifications/components/NotificationsTab";
import { ClientStatusCard } from "./ClientStatusCard";
import { ClientInfoSection } from "./ClientInfoSection";
import { ClientRelatedData } from "./ClientRelatedData";
import { ClientEditForm } from "./ClientEditForm";
import { ClientBusinessesCard } from "./ClientBusinessesCard";
import { ClientVatOverviewCard } from "./ClientVatOverviewCard";
import { ClientAuditCard } from "./ClientAuditCard";
import { CreateBusinessModal } from "./CreateBusinessModal";
import { clientsApi, clientsQK } from "../api";
import type { UpdateClientPayload, ClientResponse, CreateBusinessPayload } from "../api";
import type { ClientChargeSummary } from "../types";
import type { BinderDetailResponse } from "@/features/binders/api";
import { ChargesCreateModal } from "@/features/charges";
import { BinderDrawer } from "@/features/binders/components/BinderDrawer";
import { TaxProfileCard } from "@/features/taxProfile";
import { useClientQuickActions } from "../hooks/useClientQuickActions";
import { useFirstBusinessId } from "../hooks/useFirstBusinessId";

const EDIT_FORM_ID = "client-edit-form";

export type ClientDetailsOverviewTabProps = {
  client: ClientResponse;
  clientId: number;
  canEditClients: boolean;
  canViewCharges: boolean;
  binders: BinderDetailResponse[];
  bindersTotal: number;
  charges: ClientChargeSummary[];
  chargesTotal: number;
  updateClient: (payload: UpdateClientPayload) => Promise<void>;
  isUpdating: boolean;
  deleteClient: () => Promise<void>;
  isDeleting: boolean;
  createBusiness: (payload: CreateBusinessPayload) => Promise<void>;
  isCreatingBusiness: boolean;
  activeTab: ActiveClientDetailsTab;
};

export const ClientDetailsOverviewTab: FC<ClientDetailsOverviewTabProps> = ({
  client,
  canEditClients,
  canViewCharges,
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
  activeTab,
}) => {
  const { id: firstBusinessId } = useFirstBusinessId(client.id);
  const { data: businessesData } = useQuery({
    queryKey: clientsQK.businessesAll(client.id),
    queryFn: () => clientsApi.listAllBusinessesForClient(client.id),
    enabled: client.id > 0,
  });
  const businesses = businessesData?.items ?? [];
  const existingSoleTraderType = businesses.find(
    (b) => b.business_type === "osek_patur" || b.business_type === "osek_murshe"
  )?.business_type ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  const quickActions = useClientQuickActions({ id: client.id, name: client.full_name });

  useEffect(() => {
    document.body.style.overflow = isEditing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditing]);

  return (
    <div className="space-y-6">
      {activeTab === "details" && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <ClientInfoSection
                client={client}
                canEdit={canEditClients}
                onEditStart={() => setIsEditing(true)}
              />
              {firstBusinessId != null && (
                <TaxProfileCard businessId={firstBusinessId} readOnly={!canEditClients} />
              )}
              <ClientBusinessesCard
                clientId={client.id}
                canEdit={canEditClients}
                onAddBusiness={() => setShowBusinessModal(true)}
              />
              <ClientAuditCard clientId={client.id} />
            </div>
            <div className="space-y-6">
              <ClientRelatedData
                clientId={client.id}
                binders={binders}
                bindersTotal={bindersTotal}
                charges={charges}
                chargesTotal={chargesTotal}
                canViewCharges={canViewCharges}
                canCreateCharge={canEditClients}
                onCreateCharge={quickActions.openCreateCharge}
                onCreateBinder={quickActions.openReceiveBinder}
              />
            </div>
          </div>
        </>
      )}

      {activeTab === "communication" && (
        <div className="space-y-6">
          <AuthorityContactsCard businessId={firstBusinessId ?? 0} />
          <CorrespondenceCard businessId={firstBusinessId ?? 0} />
          <SignatureRequestsCard client={client} businessId={firstBusinessId} canManage={canEditClients} />
        </div>
      )}

      {activeTab === "finance" && (
        <div className="space-y-6">
          <ClientStatusCard clientId={client.id} />
          <ClientVatOverviewCard clientId={client.id} />
          <ClientRemindersCard clientId={client.id} businessId={firstBusinessId ?? 0} clientName={client.full_name} />
          <NotificationsTab businessId={firstBusinessId ?? 0} />
        </div>
      )}

      <Modal
        open={isConfirmingDelete}
        title="מחיקת לקוח"
        onClose={() => setIsConfirmingDelete(false)}
        footer={(
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
              className="bg-negative-600 hover:bg-negative-700 focus:ring-negative-500"
            >
              מחק לקוח
            </Button>
          </div>
        )}
      >
        <p className="text-sm text-gray-600">
          האם למחוק את הלקוח <span className="font-semibold">{client.full_name}</span>? פעולה זו אינה ניתנת לביטול.
        </p>
      </Modal>

      <CreateBusinessModal
        open={showBusinessModal}
        onClose={() => setShowBusinessModal(false)}
        onSubmit={async (data) => {
          await createBusiness(data);
          setShowBusinessModal(false);
        }}
        isLoading={isCreatingBusiness}
        clientNationalId={client.id_number}
        existingSoleTraderType={existingSoleTraderType}
      />

      <ChargesCreateModal
        open={quickActions.showCreateCharge}
        createError={quickActions.createChargeError}
        createLoading={quickActions.createChargeLoading}
        onClose={quickActions.closeCreateCharge}
        onSubmit={quickActions.submitCreateCharge}
        initialClient={{ id: client.id, name: client.full_name }}
      />

      <BinderDrawer
        open={quickActions.showReceiveBinder}
        mode="receive"
        onClose={quickActions.closeReceiveBinder}
        receiveForm={quickActions.receive.form}
        clientQuery={quickActions.receive.clientQuery}
        selectedClient={quickActions.receive.selectedClient}
        businesses={quickActions.receive.businesses}
        annualReports={quickActions.receive.annualReports}
        hasActiveBinder={quickActions.receive.hasActiveBinder}
        vatType={quickActions.receive.vatType}
        onClientSelect={quickActions.receive.handleClientSelect}
        onClientQueryChange={quickActions.receive.handleClientQueryChange}
        onReceiveSubmit={quickActions.receive.handleSubmit}
        isSubmitting={quickActions.receive.isSubmitting}
      />

      {canEditClients && (
        <DetailDrawer
          open={isEditing}
          title="עריכת פרטי לקוח"
          subtitle={client.full_name}
          onClose={() => setIsEditing(false)}
          footer={(
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setIsEditing(false); setIsConfirmingDelete(true); }}
                disabled={isUpdating}
                className="gap-2 text-negative-600 border-negative-200 hover:bg-negative-50"
              >
                <Trash2 className="h-4 w-4" />
                מחק לקוח
              </Button>
              <div className="flex items-center gap-3">
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
            </div>
          )}
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
    </div>
  );
};
