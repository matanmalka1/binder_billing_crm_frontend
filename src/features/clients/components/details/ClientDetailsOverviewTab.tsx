import { type FC, useEffect, useState } from "react";
import { type ActiveClientDetailsTab } from "../../constants";
import { Trash2 } from "lucide-react";
import { DetailDrawer } from "../../../../components/ui/overlays/DetailDrawer";
import { Button } from "../../../../components/ui/primitives/Button";
import { DeleteClientModal } from "./DeleteClientModal";
import { AuthorityContactsCard } from "@/features/authorityContacts";
import { CorrespondenceCard } from "@/features/correspondence";
import { SignatureRequestsCard } from "@/features/signatureRequests";
import { ClientRemindersCard } from "@/features/reminders";
import { NotificationsTab } from "@/features/notifications";
import { ClientStatusCard } from "./ClientStatusCard";
import { ClientInfoSection } from "./ClientInfoSection";
import { ClientEditForm } from "../edit/ClientEditForm";
import { ClientTimelineTab } from "@/features/timeline";
import { ClientAnnualReportsTab } from "@/features/annualReports";
import { ClientAdvancePaymentsTab } from "@/features/advancedPayments";
import { ClientDocumentsTab } from "@/features/documents";
import { FilingTimeline } from "@/features/taxDeadlines";
import { VatClientSummaryPanel } from "@/features/vatReports";
import type { UpdateClientPayload, ClientResponse } from "../../api";
import { useFirstBusinessId } from "../../hooks/useFirstBusinessId";

const EDIT_FORM_ID = "client-edit-form";

export type ClientDetailsOverviewTabProps = {
  client: ClientResponse;
  clientId: number;
  canEditClients: boolean;
  updateClient: (payload: UpdateClientPayload) => Promise<void>;
  isUpdating: boolean;
  deleteClient: () => Promise<void>;
  isDeleting: boolean;
  activeTab: ActiveClientDetailsTab;
};

export const ClientDetailsOverviewTab: FC<ClientDetailsOverviewTabProps> = ({
  client,
  canEditClients,
  updateClient,
  isUpdating,
  deleteClient,
  isDeleting,
  activeTab,
}) => {
  const { id: firstBusinessIdOrNull } = useFirstBusinessId(client.id);
  const firstBusinessId = firstBusinessIdOrNull ?? undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isEditing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditing]);

  useEffect(() => {
    if (activeTab !== "details") {
      setIsEditing(false);
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {activeTab === "details" && (
        <ClientInfoSection
          client={client}
          canEdit={canEditClients}
          onEditStart={() => setIsEditing(true)}
        />
      )}

      {activeTab === "communication" && (
        <div className="space-y-6">
          <AuthorityContactsCard clientId={client.id} />
          <CorrespondenceCard businessId={firstBusinessId} clientId={client.id} />
          <SignatureRequestsCard client={client} businessId={firstBusinessId} canManage={canEditClients} />
        </div>
      )}

      {activeTab === "timeline" && <ClientTimelineTab clientId={String(client.id)} />}

      {activeTab === "documents" && <ClientDocumentsTab clientId={client.id} />}

      {activeTab === "deadlines" && <FilingTimeline clientId={client.id} />}

      {activeTab === "vat" && <VatClientSummaryPanel clientId={client.id} />}

      {activeTab === "advance-payments" && <ClientAdvancePaymentsTab clientId={client.id} />}

      {activeTab === "annual-reports" && <ClientAnnualReportsTab clientId={client.id} />}

      {activeTab === "finance" && (
        <div className="space-y-6">
          <ClientStatusCard clientId={client.id} />
          <ClientRemindersCard clientId={client.id} clientName={client.full_name} />
          <NotificationsTab businessId={firstBusinessId} />
        </div>
      )}

      <DeleteClientModal
        open={isConfirmingDelete}
        clientName={client.full_name}
        isDeleting={isDeleting}
        onConfirm={async () => {
          await deleteClient();
          setIsConfirmingDelete(false);
        }}
        onCancel={() => setIsConfirmingDelete(false)}
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
