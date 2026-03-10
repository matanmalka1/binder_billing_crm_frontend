import { type FC, useEffect, useState } from "react";
import { DetailDrawer } from "../../../components/ui/DetailDrawer";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { TaxProfileCard } from "../../taxProfile/components/TaxProfileCard";
import { AuthorityContactsCard } from "../../authorityContacts/components/AuthorityContactsCard";
import { CorrespondenceCard } from "../../correspondence/components/CorrespondenceCard";
import { SignatureRequestsCard } from "../../signatureRequests/components/SignatureRequestsCard";
import { ClientRemindersCard } from "../../reminders/components/ClientRemindersCard";
import { ClientStatusCard } from "./ClientStatusCard";
import { ClientInfoSection } from "./ClientInfoSection";
import { ClientRelatedData } from "./ClientRelatedData";
import { ClientEditForm } from "./ClientEditForm";
import type { UpdateClientPayload, ClientResponse } from "../../../api/clients.api";
import type { ClientBinderSummary, ClientChargeSummary } from "../types";

const EDIT_FORM_ID = "client-edit-form";

export type ClientDetailsOverviewTabProps = {
  client: ClientResponse;
  canEditClients: boolean;
  canViewCharges: boolean;
  binders: ClientBinderSummary[];
  bindersTotal: number;
  charges: ClientChargeSummary[];
  chargesTotal: number;
  annualReportsTotal: number;
  vatWorkItemsTotal: number;
  documentsTotal: number;
  updateClient: (payload: UpdateClientPayload) => Promise<void>;
  isUpdating: boolean;
  deleteClient: () => Promise<void>;
  isDeleting: boolean;
};

export const ClientDetailsOverviewTab: FC<ClientDetailsOverviewTabProps> = ({
  client,
  canEditClients,
  canViewCharges,
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

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
          <TaxProfileCard clientId={client.id} readOnly={!canEditClients} />
          <AuthorityContactsCard clientId={client.id} />
          <CorrespondenceCard clientId={client.id} />
          <SignatureRequestsCard client={client} canManage={canEditClients} />
        </div>

        <div className="space-y-6">
          <ClientRelatedData
            clientId={client.id}
            binders={binders}
            bindersTotal={bindersTotal}
            charges={charges}
            chargesTotal={chargesTotal}
            canViewCharges={canViewCharges}
            annualReportsTotal={annualReportsTotal}
            vatWorkItemsTotal={vatWorkItemsTotal}
            documentsTotal={documentsTotal}
          />
        </div>
      </div>

      <ClientRemindersCard clientId={client.id} clientName={client.full_name} />

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
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
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
