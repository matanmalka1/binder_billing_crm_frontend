import { type FC, useEffect, useState } from "react";
import { type ActiveClientDetailsTab } from "../../constants";
import { AlertTriangle, Trash2 } from "lucide-react";
import { DetailDrawer } from "../../../../components/ui/overlays/DetailDrawer";
import { Modal } from "../../../../components/ui/overlays/Modal";
import { Button } from "../../../../components/ui/primitives/Button";
import { Input } from "../../../../components/ui/inputs/Input";
import { AuthorityContactsCard } from "../../../authorityContacts/components/AuthorityContactsCard";
import { CorrespondenceCard } from "../../../correspondence/components/CorrespondenceCard";
import { SignatureRequestsCard } from "../../../signatureRequests/components/SignatureRequestsCard";
import { ClientRemindersCard } from "../../../reminders/components/ClientRemindersCard";
import { NotificationsTab } from "../../../notifications/components/NotificationsTab";
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
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    document.body.style.overflow = isEditing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditing]);

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

      <Modal
        open={isConfirmingDelete}
        title="מחיקת לקוח"
        onClose={() => {
          setIsConfirmingDelete(false);
          setDeleteConfirmation("");
        }}
        footer={(
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsConfirmingDelete(false);
                setDeleteConfirmation("");
              }}
              disabled={isDeleting}
            >
              ביטול
            </Button>
            <Button
              type="button"
              variant="primary"
              isLoading={isDeleting}
              disabled={isDeleting || deleteConfirmation !== client.full_name}
              onClick={async () => {
                await deleteClient();
                setIsConfirmingDelete(false);
                setDeleteConfirmation("");
              }}
              className="bg-negative-600 hover:bg-negative-700 focus:ring-negative-500"
            >
              מחק לקוח
            </Button>
          </div>
        )}
      >
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg border border-negative-200 bg-negative-50 p-4 text-negative-900">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold">
                מחיקת הלקוח {client.full_name} היא פעולה בלתי הפיכה.
              </p>
              <p>
                המחיקה תסיר את רשומת הלקוח מהעבודה השוטפת ועלולה להשפיע על תצוגת מסמכים,
                מועדים, חיובים, קלסרים והיסטוריית פעילות המקושרים ללקוח.
              </p>
            </div>
          </div>
          <Input
            label="כדי למחוק, יש להקליד את שם הלקוח במדויק"
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            disabled={isDeleting}
          />
        </div>
      </Modal>

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
