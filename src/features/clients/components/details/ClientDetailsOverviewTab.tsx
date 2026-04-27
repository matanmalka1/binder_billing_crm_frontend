import { type FC, useEffect, useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { clientsApi, clientsQK } from "../../api";
import type { CreateBusinessPayload } from "../../api";
import { getErrorMessage, showErrorToast } from "@/utils/utils";
import { toast } from "@/utils/toast";
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
import { ClientBusinessesCard } from "./ClientBusinessesCard";
import { ClientRelatedData } from "./ClientRelatedData";
import { CreateBusinessModal } from "../business/CreateBusinessModal";
import { ClientEditForm } from "../edit/ClientEditForm";
import { ChargesCreateModal, chargesApi, chargesQK } from "@/features/charges";
import type { CreateChargePayload } from "@/features/charges";
import { bindersApi, bindersQK } from "@/features/binders";
import { ClientTimelineTab } from "@/features/timeline";
import { ClientAnnualReportsTab } from "@/features/annualReports";
import { ClientAdvancePaymentsTab } from "@/features/advancedPayments";
import { ClientDocumentsTab } from "@/features/documents";
import { ClientNotesCard } from "@/features/notes";
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
  isEditing: boolean;
  onEditClose: () => void;
};

export const ClientDetailsOverviewTab: FC<ClientDetailsOverviewTabProps> = ({
  client,
  canEditClients,
  updateClient,
  isUpdating,
  deleteClient,
  isDeleting,
  activeTab,
  isEditing,
  onEditClose,
}) => {
  const { id: firstBusinessIdOrNull } = useFirstBusinessId(client.id);
  const firstBusinessId = firstBusinessIdOrNull ?? undefined;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const relatedPageSize = 5;
  const relatedBindersQuery = useQuery({
    queryKey: bindersQK.forClientPage(client.id, 1, relatedPageSize),
    queryFn: () => bindersApi.listClientBinders(client.id, { page: 1, page_size: relatedPageSize }),
    enabled: activeTab === "details",
  });
  const relatedChargesQuery = useQuery({
    queryKey: chargesQK.forClientPage(client.id, 1, relatedPageSize),
    queryFn: () => chargesApi.list({ client_record_id: client.id, page: 1, page_size: relatedPageSize }),
    enabled: activeTab === "details",
  });
  const createBusinessMutation = useMutation({
    mutationFn: (payload: CreateBusinessPayload) => clientsApi.createBusiness(client.id, payload),
    onSuccess: () => {
      toast.success("העסק נוצר בהצלחה");
      void queryClient.invalidateQueries({ queryKey: clientsQK.businessesAll(client.id) });
      void queryClient.invalidateQueries({ queryKey: clientsQK.businesses(client.id) });
      setIsAddingBusiness(false);
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת עסק"),
  });
  const createChargeMutation = useMutation({
    mutationFn: (payload: CreateChargePayload) => chargesApi.create(payload),
    onSuccess: async () => {
      toast.success("חיוב נוצר בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chargesQK.all }),
        queryClient.invalidateQueries({ queryKey: chargesQK.forClientPage(client.id, 1, relatedPageSize) }),
      ]);
      setIsAddingCharge(false);
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת חיוב"),
  });
  const handleCreateBusiness = useCallback(
    async (payload: CreateBusinessPayload) => { await createBusinessMutation.mutateAsync(payload); },
    [createBusinessMutation],
  );
  const handleCreateCharge = useCallback(
    async (payload: CreateChargePayload) => {
      try {
        await createChargeMutation.mutateAsync(payload);
        return true;
      } catch {
        return false;
      }
    },
    [createChargeMutation],
  );

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isAddingBusiness, setIsAddingBusiness] = useState(false);
  const [isAddingCharge, setIsAddingCharge] = useState(false);

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
          <ClientInfoSection
            client={client}
            sideContent={<ClientNotesCard clientId={client.id} canEdit={canEditClients} />}
          />
          <ClientBusinessesCard
            clientId={client.id}
            canEdit={canEditClients}
            onAddBusiness={() => setIsAddingBusiness(true)}
          />
          <ClientRelatedData
            clientId={client.id}
            binders={relatedBindersQuery.data?.items ?? []}
            bindersTotal={relatedBindersQuery.data?.total ?? 0}
            charges={relatedChargesQuery.data?.items ?? []}
            chargesTotal={relatedChargesQuery.data?.total ?? 0}
            canViewCharges={true}
            canCreateCharge={canEditClients}
            onCreateCharge={() => setIsAddingCharge(true)}
            onCreateBinder={() => navigate(`/binders?client_record_id=${client.id}`)}
          />
          <CreateBusinessModal
            open={isAddingBusiness}
            onClose={() => setIsAddingBusiness(false)}
            onSubmit={handleCreateBusiness}
            isLoading={createBusinessMutation.isPending}
          />
          <ChargesCreateModal
            open={isAddingCharge}
            createError={
              createChargeMutation.error
                ? getErrorMessage(createChargeMutation.error, "שגיאה ביצירת חיוב")
                : null
            }
            createLoading={createChargeMutation.isPending}
            onClose={() => setIsAddingCharge(false)}
            onSubmit={handleCreateCharge}
            initialClient={{ id: client.id, name: client.full_name }}
          />
        </>
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
          onClose={onEditClose}
          footer={(
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => { onEditClose(); setIsConfirmingDelete(true); }}
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
                  onClick={onEditClose}
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
              onEditClose();
            }}
            onCancel={onEditClose}
            isLoading={isUpdating}
          />
        </DetailDrawer>
      )}
    </div>
  );
};
