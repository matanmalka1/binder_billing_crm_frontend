import { type FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { CreateBusinessModal } from "./CreateBusinessModal";
import { clientsApi, clientsQK } from "../api";
import type { UpdateClientPayload, ClientResponse, CreateBusinessPayload } from "../api";
import type { ClientChargeSummary } from "../types";
import type { BinderDetailResponse } from "@/features/binders/api";
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

  useEffect(() => {
    document.body.style.overflow = isEditing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditing]);

  return (
    <div className="space-y-6">
      <ClientStatusCard clientId={client.id} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ClientInfoSection
            client={client}
            canEdit={canEditClients}
            onEditStart={() => setIsEditing(true)}
            onDeleteStart={canEditClients ? () => setIsConfirmingDelete(true) : undefined}
          />
          <ClientBusinessesCard
            clientId={client.id}
            canEdit={canEditClients}
            onAddBusiness={() => setShowBusinessModal(true)}
          />
          <ClientVatOverviewCard clientId={client.id} />
          <AuthorityContactsCard businessId={firstBusinessId ?? 0} />
          <CorrespondenceCard businessId={firstBusinessId ?? 0} />
          <SignatureRequestsCard client={client} businessId={firstBusinessId} canManage={canEditClients} />
        </div>

        <div className="space-y-6">
          <ClientRelatedData
            clientId={client.id}
            binders={binders}
            bindersTotal={bindersTotal}
            charges={charges}
            chargesTotal={chargesTotal}
            canViewCharges={canViewCharges}
          />
        </div>
      </div>

      <ClientRemindersCard clientId={client.id} businessId={firstBusinessId ?? 0} clientName={client.full_name} />
      <NotificationsTab businessId={firstBusinessId ?? 0} />

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

      {canEditClients && (
        <DetailDrawer
          open={isEditing}
          title="עריכת פרטי לקוח"
          subtitle={client.full_name}
          onClose={() => setIsEditing(false)}
          footer={(
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
