import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { History, Send, X, FileSignature, Link2, ClipboardCheck, Clock, AlertCircle } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageStateGuard } from "../../components/ui/PageStateGuard";
import { DataTable } from "../../components/ui/DataTable";
import { StatsCard } from "../../components/ui/StatsCard";
import { SignatureStatusBadge } from "../../features/signatureRequests/components/SignatureStatusBadge";
import { SignatureRequestAuditDrawer } from "../../features/signatureRequests/components/SignatureRequestAuditDrawer";
import { usePendingSignatureRequests } from "../../features/signatureRequests/hooks/usePendingSignatureRequests";
import { usePendingSignatureRequestActions } from "../../features/signatureRequests/hooks/usePendingSignatureRequestActions";
import type { SignatureRequestResponse } from "../../api/signatureRequests.api";
import { getSignatureRequestTypeLabel } from "../../utils/enums";
import { formatDate } from "../../utils/utils";

export const SignatureRequestsPage: React.FC = () => {
  const { items, total, clientNames, isLoading, error } = usePendingSignatureRequests();
  const { send, isSending, cancel, isCanceling } = usePendingSignatureRequestActions();

  const [signingUrls, setSigningUrls] = useState<Record<number, string>>({});
  const [auditRequestId, setAuditRequestId] = useState<number | null>(null);

  const draft = items.filter((r) => r.status === "draft").length;
  const pending = items.filter((r) => r.status === "pending_signature").length;
  const terminal = items.filter((r) => ["expired", "declined"].includes(r.status)).length;

  const handleSend = async (id: number) => {
    const result = await send(id);
    if (result?.signing_url_hint) {
      const hint = result.signing_url_hint;
      const path = hint.startsWith("/") ? hint : `/${hint}`;
      setSigningUrls((prev) => ({ ...prev, [id]: `${window.location.origin}${path}` }));
    }
  };

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
            to={`/clients/${req.client_id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-gray-700 hover:text-blue-600 hover:underline"
          >
            {clientNames[req.client_id] ?? `#${req.client_id}`}
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
        render: (req: SignatureRequestResponse) => (
          <SignatureStatusBadge status={req.status} />
        ),
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
        header: "פעולות",
        render: (req: SignatureRequestResponse) => {
          const isDraft = req.status === "draft";
          const isTerminal = ["signed", "declined", "expired", "canceled"].includes(req.status);
          const signingUrl = signingUrls[req.id];
          return (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {isDraft && (
                <button
                  type="button"
                  disabled={isSending}
                  onClick={() => void handleSend(req.id)}
                  title="שלח לחתימה"
                  className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
                >
                  <Send className="h-3 w-3" />
                  שלח
                </button>
              )}
              {req.status === "pending_signature" && signingUrl && (
                <a
                  href={signingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  <Link2 className="h-3 w-3" />
                  קישור
                </a>
              )}
              {!isTerminal && (
                <button
                  type="button"
                  disabled={isCanceling}
                  onClick={() => void cancel(req.id)}
                  title="בטל בקשה"
                  className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setAuditRequestId(req.id)}
                title="היסטוריית פעילות"
                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <History className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clientNames, signingUrls, isSending, isCanceling],
  );

  const header = (
    <PageHeader
      title="בקשות חתימה"
      description="כל בקשות החתימה הפעילות בכלל הלקוחות"
      variant="gradient"
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

        <DataTable
          data={items}
          columns={columns}
          getRowKey={(req) => req.id}
          isLoading={false}
          emptyState={{
            icon: FileSignature,
            title: "אין בקשות חתימה",
            message: "אין בקשות חתימה פעילות להצגה",
          }}
        />
      </div>

      <SignatureRequestAuditDrawer
        requestId={auditRequestId}
        onClose={() => setAuditRequestId(null)}
      />
    </PageStateGuard>
  );
};
