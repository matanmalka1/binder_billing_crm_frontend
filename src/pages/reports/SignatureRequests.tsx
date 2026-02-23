import { useState } from "react";
import { Link } from "react-router-dom";
import { History, Send, X } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageStateGuard } from "../../components/ui/PageStateGuard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SignatureStatusBadge } from "../../features/signatureRequests/components/SignatureStatusBadge";
import { SignatureRequestAuditDrawer } from "../../features/signatureRequests/components/SignatureRequestAuditDrawer";
import { usePendingSignatureRequests } from "../../features/signatureRequests/hooks/usePendingSignatureRequests";
import { usePendingSignatureRequestActions } from "../../features/signatureRequests/hooks/usePendingSignatureRequestActions";
import type { SignatureRequestResponse } from "../../api/signatureRequests.api";
import { getSignatureRequestTypeLabel } from "../../utils/enums";
import { formatDate } from "../../utils/utils";
import { FileSignature } from "lucide-react";

// ── Summary strip ──────────────────────────────────────────────────────────────

interface SummaryStripProps {
  items: SignatureRequestResponse[];
  total: number;
}

const SummaryStrip: React.FC<SummaryStripProps> = ({ items, total }) => {
  const draft = items.filter((r) => r.status === "draft").length;
  const pending = items.filter((r) => r.status === "pending_signature").length;
  const terminal = items.filter((r) =>
    ["expired", "declined"].includes(r.status),
  ).length;

  const chips = [
    { label: "סה\"כ", value: total },
    { label: "טיוטה", value: draft },
    { label: "ממתין לחתימה", value: pending },
    { label: "פג/נדחה", value: terminal },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {chips.map((chip) => (
        <div
          key={chip.label}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm"
        >
          <span className="text-xl font-bold text-gray-900">{chip.value}</span>
          <span className="text-sm text-gray-500">{chip.label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────

export const SignatureRequestsPage: React.FC = () => {
  const { items, total, clientNames, isLoading, error } =
    usePendingSignatureRequests();
  const { send, isSending, cancel, isCanceling } =
    usePendingSignatureRequestActions();

  const [signingUrls, setSigningUrls] = useState<Record<number, string>>({});
  const [auditRequestId, setAuditRequestId] = useState<number | null>(null);

  const handleSend = async (id: number) => {
    const result = await send(id);
    if (result?.signing_url_hint) {
      const hint = result.signing_url_hint;
      const path = hint.startsWith("/") ? hint : `/${hint}`;
      setSigningUrls((prev) => ({
        ...prev,
        [id]: `${window.location.origin}${path}`,
      }));
    }
  };

  const header = (
    <PageHeader
      title="בקשות חתימה"
      description="כל בקשות החתימה הפעילות בכלל הלקוחות"
      variant="gradient"
    />
  );

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error}
      header={header}
      loadingMessage="טוען בקשות חתימה..."
    >
      <SummaryStrip items={items} total={total} />

      {items.length === 0 ? (
        <EmptyState icon={FileSignature} message="אין בקשות חתימה פעילות" />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">כותרת</th>
                <th className="px-4 py-3">לקוח</th>
                <th className="px-4 py-3">סוג</th>
                <th className="px-4 py-3">חותם</th>
                <th className="px-4 py-3">סטטוס</th>
                <th className="px-4 py-3">נוצר</th>
                <th className="px-4 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((req) => {
                const isDraft = req.status === "draft";
                const isTerminal = ["signed", "declined", "expired", "canceled"].includes(req.status);
                const signingUrl = signingUrls[req.id];

                return (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {req.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <Link
                        to={`/clients/${req.client_id}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {clientNames[req.client_id] ?? `#${req.client_id}`}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {getSignatureRequestTypeLabel(req.request_type)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{req.signer_name}</td>
                    <td className="px-4 py-3">
                      <SignatureStatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(req.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {isDraft && (
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={isSending}
                            onClick={() => handleSend(req.id)}
                            title="שלח לחתימה"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>שלח</span>
                          </Button>
                        )}
                        {req.status === "pending_signature" && signingUrl && (
                          <a
                            href={signingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            קישור
                          </a>
                        )}
                        {!isTerminal && (
                          <Button
                            variant="ghost"
                            size="sm"
                            isLoading={isCanceling}
                            onClick={() => cancel(req.id)}
                            title="בטל בקשה"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAuditRequestId(req.id)}
                          title="היסטוריית פעילות"
                        >
                          <History className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <SignatureRequestAuditDrawer
        requestId={auditRequestId}
        onClose={() => setAuditRequestId(null)}
      />
    </PageStateGuard>
  );
};
