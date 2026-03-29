import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileSignature, ClipboardCheck, Clock, AlertCircle, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageStateGuard } from "@/components/ui/PageStateGuard";
import { DataTable } from "@/components/ui/DataTable";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  CreateSignatureRequestModal,
  SIGNATURE_REQUEST_TERMINAL_STATUSES,
  SignatureRequestAuditDrawer,
  SignatureRequestsPageRowActions,
  signatureRequestStatusVariants,
  useSignatureRequestSigningUrls,
  usePendingSignatureRequests,
  useSignatureRequestActions,
  type SignatureRequestResponse,
} from "@/features/signatureRequests";
import { getSignatureRequestTypeLabel, getSignatureRequestStatusLabel } from "@/utils/enums";
import { formatDate } from "@/utils/utils";

export const SignatureRequestsPage: React.FC = () => {
  const { items, total, businessLookup, isLoading, error } = usePendingSignatureRequests();
  const { send, isSending, cancel, isCanceling, create, isCreating } = useSignatureRequestActions();

  const [auditRequestId, setAuditRequestId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const { signingUrls, handleSend } = useSignatureRequestSigningUrls(send);

  const draft = items.filter((r) => r.status === "draft").length;
  const pending = items.filter((r) => r.status === "pending_signature").length;
  const terminal = items.filter((r) => ["expired", "declined"].includes(r.status)).length;

  const displayedItems = useMemo(
    () => showAll ? items : items.filter((r) => !SIGNATURE_REQUEST_TERMINAL_STATUSES.has(r.status)),
    [items, showAll],
  );

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "כותרת",
        render: (req: SignatureRequestResponse) => (
          <span className="font-semibold text-gray-900">{req.title}</span>
        ),
      },
      {
        key: "client",
        header: "לקוח",
        render: (req: SignatureRequestResponse) => (
          <Link
            to={`/clients/${businessLookup[req.business_id]?.clientId ?? req.business_id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-gray-700 hover:text-primary-600 hover:underline"
          >
            {businessLookup[req.business_id]?.name ?? `עסק #${req.business_id}`}
          </Link>
        ),
      },
      {
        key: "type",
        header: "סוג",
        render: (req: SignatureRequestResponse) => (
          <span className="text-gray-500">{getSignatureRequestTypeLabel(req.request_type)}</span>
        ),
      },
      {
        key: "signer",
        header: "חותם",
        render: (req: SignatureRequestResponse) => (
          <span className="text-gray-600">{req.signer_name}</span>
        ),
      },
      {
        key: "status",
        header: "סטטוס",
        render: (req: SignatureRequestResponse) => <StatusBadge status={req.status} getLabel={getSignatureRequestStatusLabel} variantMap={signatureRequestStatusVariants} />,
      },
      {
        key: "created_at",
        header: "נוצר",
        render: (req: SignatureRequestResponse) => (
          <span className="tabular-nums text-gray-500">{formatDate(req.created_at)}</span>
        ),
      },
      {
        key: "actions",
        header: "",
        headerClassName: "w-10",
        className: "w-10",
        render: (req: SignatureRequestResponse) => (
          <SignatureRequestsPageRowActions
            req={req}
            signingUrl={signingUrls[req.id]}
            isSending={isSending}
            isCanceling={isCanceling}
            onSend={(id) => void handleSend(id)}
            onCancel={(id) => void cancel(id)}
            onAudit={setAuditRequestId}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [businessLookup, signingUrls, isSending, isCanceling],
  );

  const header = (
    <PageHeader
      title="בקשות חתימה"
      description="כל בקשות החתימה הפעילות בכלל הלקוחות"
      actions={
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-3.5 w-3.5" />
          בקשה חדשה
        </Button>
      }
    />
  );

  return (
    <PageStateGuard isLoading={isLoading} error={error} header={header} loadingMessage="טוען בקשות חתימה...">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatsCard title='סה"כ' value={total} icon={FileSignature} variant="neutral" />
          <StatsCard title="טיוטה" value={draft} icon={ClipboardCheck} variant="blue" />
          <StatsCard title="ממתין לחתימה" value={pending} icon={Clock} variant="purple" />
          <StatsCard title="פג / נדחה" value={terminal} icon={AlertCircle} variant="orange" />
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "הסתר סגורות" : "הצג הכל"}
          </Button>
        </div>

        <DataTable
          data={displayedItems}
          columns={columns}
          getRowKey={(req) => req.id}
          onRowClick={(req) => setAuditRequestId(req.id)}
          isLoading={false}
          emptyState={{
            icon: FileSignature,
            title: "אין בקשות חתימה",
            message: showAll ? "אין בקשות חתימה להצגה" : "אין בקשות חתימה פעילות — לחץ על 'הצג הכל' לצפייה בארכיון",
          }}
        />
      </div>

      <SignatureRequestAuditDrawer
        requestId={auditRequestId}
        onClose={() => setAuditRequestId(null)}
      />

      <CreateSignatureRequestModal
        open={showCreate}
        isLoading={isCreating}
        onClose={() => setShowCreate(false)}
        onCreate={create}
      />
    </PageStateGuard>
  );
};
